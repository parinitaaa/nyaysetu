# backend/chatbot/rag_pipeline.py

from .retriever import retrieve_context
from .generator import generate_answer

def ask_question(question: str):
    context = retrieve_context(question)
    answer = generate_answer(question, context)
    return answer