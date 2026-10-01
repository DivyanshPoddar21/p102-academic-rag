from pathlib import Path
from backend.app.services.ingestion import DocumentIngestionService
from backend.app.engines.retrieval import RetrievalEngine


def test_indexing_and_search():
    pdf_path = Path("data/study_pdfs/MLT Unit 1.1.pdf")
    ingestion = DocumentIngestionService()
    chunks = ingestion.chunk_document(pdf_path)

    # Build FAISS index
    engine = RetrievalEngine()
    engine.build_index(chunks)
    assert engine.index is not None
    assert engine.index.ntotal == len(chunks)

    # 1. In-scope query test
    query_in = "What is machine learning?"
    results, is_confident, top_score = engine.retrieve(query_in, top_k=2, confidence_threshold=0.45)
    print(f"\nQuery: '{query_in}'")
    print(f"Confidence Gate Passed: {is_confident} (Top Score: {top_score:.4f})")
    for r in results:
        print(f" -> [{r.source} - Page {r.page_number}] Score: {r.score:.4f}")
    assert is_confident is True

    # 2. Out-of-scope query test (must fail confidence gate)
    query_out = "How to make Italian pasta carbonara?"
    results_out, is_confident_out, top_score_out = engine.retrieve(query_out, top_k=2, confidence_threshold=0.45)
    print(f"\nQuery: '{query_out}'")
    print(f"Confidence Gate Passed: {is_confident_out} (Top Score: {top_score_out:.4f})")
    assert is_confident_out is False


if __name__ == "__main__":
    test_indexing_and_search()