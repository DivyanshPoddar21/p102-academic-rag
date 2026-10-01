import json
from pathlib import Path
from typing import List, Tuple
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

from backend.app.domain.qa import RetrievalResult


class RetrievalEngine:
    def __init__(
        self,
        model_name: str = "sentence-transformers/all-MiniLM-L6-v2",
        index_dir: str = "data/index"
    ):
        self.model = SentenceTransformer(model_name)
        self.index_dir = Path(index_dir)
        self.index_dir.mkdir(parents=True, exist_ok=True)
        self.index_file = self.index_dir / "academic_faiss.index"
        self.metadata_file = self.index_dir / "chunks_metadata.json"

        self.index = None
        self.chunks_data = []

        # Load existing index if available
        self.load_index()

    def build_index(self, chunks: List[dict]):
        """Embeds text chunks and saves a normalized FAISS inner-product index."""
        if not chunks:
            raise ValueError("No chunks provided to build index.")

        texts = [chunk["text"] for chunk in chunks]
        self.chunks_data = chunks

        # Compute and normalize embeddings for cosine similarity
        embeddings = self.model.encode(texts, convert_to_numpy=True, show_progress_bar=True)
        embeddings = embeddings.astype(np.float32)
        faiss.normalize_L2(embeddings)

        dimension = embeddings.shape[1]
        self.index = faiss.IndexFlatIP(dimension)
        self.index.add(embeddings)

        # Persist index and metadata to disk
        faiss.write_index(self.index, str(self.index_file))
        with open(self.metadata_file, "w", encoding="utf-8") as f:
            json.dump(self.chunks_data, f, ensure_ascii=False, indent=2)

    def load_index(self) -> bool:
        """Loads index and metadata from disk if they exist."""
        if self.index_file.exists() and self.metadata_file.exists():
            self.index = faiss.read_index(str(self.index_file))
            with open(self.metadata_file, "r", encoding="utf-8") as f:
                self.chunks_data = json.load(f)
            return True
        return False

    def retrieve(
        self,
        query: str,
        top_k: int = 3,
        confidence_threshold: float = 0.45
    ) -> Tuple[List[RetrievalResult], bool, float]:
        """
        Retrieves top_k chunks for a query.
        Returns: (results, is_confident, top_score)
        """
        if self.index is None or not self.chunks_data:
            raise RuntimeError("Index is not loaded or built.")

        query_vector = self.model.encode([query], convert_to_numpy=True).astype(np.float32)
        faiss.normalize_L2(query_vector)

        scores, indices = self.index.search(query_vector, top_k)
        scores = scores[0]
        indices = indices[0]

        results = []
        for score, idx in zip(scores, indices):
            if idx == -1:
                continue
            chunk = self.chunks_data[idx]
            results.append(
                RetrievalResult(
                    chunk_id=chunk["chunk_id"],
                    text=chunk["text"],
                    source=chunk["metadata"]["source"],
                    page_number=chunk["metadata"]["page_number"],
                    score=float(score)
                )
            )

        top_score = float(scores[0]) if len(scores) > 0 else 0.0
        is_confident = top_score >= confidence_threshold

        return results, is_confident, top_score