from pathlib import Path
from typing import Dict, List
import fitz  # PyMuPDF


class DocumentIngestionService:
    def __init__(self, chunk_size: int = 500, chunk_overlap: int = 100):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def extract_pages(self, pdf_path: str | Path) -> List[Dict]:
        """Extract text page-by-page to preserve accurate page citations."""
        path = Path(pdf_path)
        if not path.exists():
            raise FileNotFoundError(f"File not found: {path}")

        doc = fitz.open(path)
        pages_data = []

        for page_num in range(len(doc)):
            page = doc[page_num]
            text = page.get_text("text").strip()
            if text:
                pages_data.append({
                    "page_number": page_num + 1,
                    "text": text,
                    "source": path.name
                })

        doc.close()
        return pages_data

    def chunk_document(self, pdf_path: str | Path) -> List[Dict]:
        """
        Split document text into overlapping chunks while mapping each chunk
        back to its exact PDF page number.
        """
        pages = self.extract_pages(pdf_path)
        chunks = []
        chunk_idx = 0

        for page_info in pages:
            page_text = page_info["text"]
            page_num = page_info["page_number"]
            source = page_info["source"]

            words = page_text.split()
            if not words:
                continue

            # Sliding window over words
            step = self.chunk_size - self.chunk_overlap
            if step <= 0:
                step = self.chunk_size

            for i in range(0, len(words), step):
                chunk_words = words[i:i + self.chunk_size]
                chunk_text = " ".join(chunk_words)

                chunks.append({
                    "chunk_id": f"{Path(source).stem}_p{page_num}_c{chunk_idx}",
                    "text": chunk_text,
                    "metadata": {
                        "source": source,
                        "page_number": page_num,
                        "word_count": len(chunk_words)
                    }
                })
                chunk_idx += 1

        return chunks