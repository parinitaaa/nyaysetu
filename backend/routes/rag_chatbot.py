from fastapi import APIRouter
from pydantic import BaseModel
from rag import ask_question

router = APIRouter(prefix="/rag", tags=["RAG Chatbot"])

class ChatRequest(BaseModel):
    question: str

@router.post("/chat")
def chat(request: ChatRequest):
    answer = ask_question(request.question)
    return {"answer": answer}