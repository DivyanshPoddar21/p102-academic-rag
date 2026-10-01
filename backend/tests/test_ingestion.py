from pathlib import Path
from backend.app.services.ingestion import DocumentIngestionService


def test_pdf_ingestion():
    pdf_path = Path("data/study_pdfs/MLT Unit 1.1.pdf")
    assert pdf_path.exists(), f"PDF not found at {pdf_path}"

    service = DocumentIngestionService(chunk_size=500, chunk_overlap=100)
    chunks = service.chunk_document(pdf_path)

    print(f"\n--- Ingestion Results ---")
    print(f"Total Chunks Generated: {len(chunks)}")
    print(f"Total Pages Processed: {chunks[-1]['metadata']['page_number']}")
    print(f"\n--- First Chunk Preview ---")
    print(f"Chunk ID: {chunks[0]['chunk_id']}")
    print(f"Source: {chunks[0]['metadata']['source']}")
    print(f"Page: {chunks[0]['metadata']['page_number']}")
    print(f"Text Snippet: {chunks[0]['text'][:200]}...")

    assert len(chunks) > 0
    assert "page_number" in chunks[0]["metadata"]


if __name__ == "__main__":
    test_pdf_ingestion()