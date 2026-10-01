import os
from typing import List
from dotenv import load_dotenv
from groq import Groq

from backend.app.domain.qa import QuestionResponse, RetrievalResult

load_dotenv()


class GenerationService:
    def __init__(self, model: str = None):
        self.api_key = os.getenv("GROQ_API_KEY")
        if not self.api_key:
            raise ValueError("GROQ_API_KEY is not set in your .env file.")
        self.client = Groq(api_key=self.api_key)
        self.model = model or os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")

    def format_context(self, retrieved_chunks: List[RetrievalResult]) -> str:
        """Formats retrieved chunks with strict page-citation tags."""
        context_blocks = []
        for c in retrieved_chunks:
            context_blocks.append(
                f"[Source: {c.source} | Page {c.page_number}]\n{c.text}"
            )
        return "\n\n---\n\n".join(context_blocks)

    def answer_question(
        self,
        question: str,
        retrieved_chunks: List[RetrievalResult],
        is_confident: bool,
        confidence_score: float
    ) -> QuestionResponse:
        # Confidence Gate Refusal
        if not is_confident or not retrieved_chunks:
            return QuestionResponse(
                answer=(
                    "I cannot answer this question based on the provided course material. "
                    "The retrieved context falls below the required confidence threshold."
                ),
                citations=[],
                confidence_score=confidence_score,
                gated=True,
                model=self.model
            )

        context = self.format_context(retrieved_chunks)

        system_prompt = (
            "You are an academic AI tutor answering questions strictly based on the provided course material.\n"
            "Rules:\n"
            "1. Answer ONLY using the facts from the context below.\n"
            "2. At the end of every substantive claim, cite the source page using [Page X].\n"
            "3. If the context does not fully answer the prompt, say what is known and state what is missing."
        )

        user_prompt = f"Context Material:\n{context}\n\nQuestion: {question}"

        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.1
        )

        citations = [
            {"source": c.source, "page_number": c.page_number, "score": round(c.score, 4)}
            for c in retrieved_chunks
        ]

        return QuestionResponse(
            answer=response.choices[0].message.content,
            citations=citations,
            confidence_score=round(confidence_score, 4),
            gated=False,
            model=self.model
        )