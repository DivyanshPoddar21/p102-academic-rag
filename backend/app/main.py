from fastapi import FastAPI
from backend.app.api.routes import qa

app = FastAPI(
    title="P102 Academic RAG System",
    description="FastAPI hybrid RAG system with page-level citations and confidence gating.",
    version="0.1.0"
)

app.include_router(qa.router, prefix="/api/v1")


@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "academic-rag-backend"}