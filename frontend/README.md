# VERITAS — Academic QA Gateway (P102 Academic RAG)

A production-grade Retrieval-Augmented Generation (RAG) system grounded in academic course materials (*Machine Learning Techniques*), featuring strict confidence gating against synthetic hallucinations and page-level provenance attribution.

---

## Architecture Overview

- **Vector Retrieval**: Local embeddings via `sentence-transformers/all-MiniLM-L6-v2` and FAISS indexing.
- **Confidence Gating**: Strict similarity threshold scoring to reject out-of-scope inquiries and mitigate hallucinations.
- **Backend**: FastAPI REST API providing asynchronous document ingestion, retrieval, and synthesis endpoints.
- **Frontend**: Modern React + TypeScript SPA built with Vite, Tailwind CSS v4, and Lucide icons.
- **Authentication**: JWT-simulated institutional student portal.

---

## Project Structure

```text
p102-academic-rag/
├── backend/
│   ├── app/
│   │   ├── api/routes/qa.py       # QA query endpoint
│   │   ├── engines/retrieval.py   # FAISS retriever engine
│   │   ├── services/              # Ingestion & generation services
│   │   └── main.py                # FastAPI entry point & CORS
│   └── tests/                     # Pytest suite
├── data/
│   ├── study_pdfs/                # Source documents (MLT Unit 1.1.pdf)
│   └── index/                     # Serialized FAISS vector store
├── frontend/                      # React / Vite / Tailwind UI
│   ├── src/
│   │   ├── pages/                 # Login & Workspace views
│   │   ├── services/api.ts        # Axios client
│   │   └── types/index.ts         # TypeScript data contracts
└── README.md