# backend/chatbot/generator.py

import ollama

def generate_answer(question: str, context: str):
    print("🧠 Generating answer...")
    prompt = f"""
You are NyaySetu, a legal assistant for Indian users.

Answer the question using ONLY the information in the context.
You may rephrase and combine points to sound natural.
If steps or reporting methods are mentioned, include them.

Context:
{context}

Question:
{question}

Answer in simple, user-friendly language:
"""

    response = ollama.chat(
        model="llama3.2:1b",
        messages=[{"role": "user", "content": prompt}]
    )

    return response["message"]["content"]