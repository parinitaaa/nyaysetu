# routes/chatbot.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from chatbot_tfidf import search  # Import your TF-IDF search function

router = APIRouter(prefix="/chatbot", tags=["Chatbot"])

# Request body model
class QuestionRequest(BaseModel):
    question: str

@router.post("/ask")
def ask_question(request: QuestionRequest):
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")
    
    answer, category, score = search(request.question)
    
    # Optional: apply a threshold for low-confidence answers
    if score < 0.2:
        return {
            "answer": "Sorry, I don't have an answer for that yet.",
            "category": None,
            "score": score
        }
    
    return {
        "answer": answer,
        "category": category,
        "score": score
    }