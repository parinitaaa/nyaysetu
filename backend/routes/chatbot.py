# backend/routes/chatbot.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from chatbot.rag_pipeline import ask_question

router = APIRouter(prefix="/chatbot", tags=["Chatbot"])

class QuestionRequest(BaseModel):
    question: str

@router.post("/ask")
def ask(request: QuestionRequest):
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    answer = ask_question(request.question)

    return {
        "answer": answer
    }