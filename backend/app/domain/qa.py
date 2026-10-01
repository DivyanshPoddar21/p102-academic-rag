from typing import Dict, List, Optional
from pydantic import BaseModel, Field


class DocumentChunk(BaseModel):
    chunk_id: str
    text: str
    metadata: Dict = Field(default_factory=dict)


class RetrievalResult(BaseModel):
    chunk_id: str
    text: str
    source: str
    page_number: int
    score: float  # Cosine similarity score (0.0 to 1.0)


class QuestionRequest(BaseModel):
    question: str = Field(..., min_length=3, description="Academic question text")
    top_k: int = Field(default=3, ge=1, le=10)
    confidence_threshold: float = Field(default=0.45, ge=0.0, le=1.0)


class QuestionResponse(BaseModel):
    answer: str
    citations: List[Dict]
    confidence_score: float
    gated: bool  # True if below threshold (question refused)
    model: str