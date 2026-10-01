from fastapi import APIRouter, HTTPException
from backend.app.domain.qa import QuestionRequest, QuestionResponse
from backend.app.engines.retrieval import RetrievalEngine
from backend.app.services.generation import GenerationService

router = APIRouter(prefix="/qa", tags=["Academic QA"])

# Initialize persistent engines
retrieval_engine = RetrievalEngine()
generation_service = None

def get_generation_service():
    global generation_service
    if generation_service is None:
        generation_service = GenerationService()
    return generation_service


@router.post("/ask", response_model=QuestionResponse)
def ask_question(payload: QuestionRequest):
    try:
        results, is_confident, top_score = retrieval_engine.retrieve(
            query=payload.question,
            top_k=payload.top_k,
            confidence_threshold=payload.confidence_threshold
        )

        gen = get_generation_service()
        response = gen.answer_question(
            question=payload.question,
            retrieved_chunks=results,
            is_confident=is_confident,
            confidence_score=top_score
        )
        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))