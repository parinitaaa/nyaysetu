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



def generate_procedure_answer(question: str, procedure_context: str):
    print("🧠 Generating procedure answer...")
    prompt = f"""
You are NyaySetu, a legal assistant for Indian users.

Your job is to explain legal procedures clearly and simply.

Use ONLY the provided procedure context.
Do not invent extra legal details.
Answer in this format:
1. Short summary
2. Step-by-step procedure
3. Documents required
4. Where to file
5. Legal basis if available

Procedure Context:
{procedure_context}

User Question:
{question}

Answer in simple, user-friendly language:
"""

    response = ollama.chat(
        model="llama3.2:1b",
        messages=[{"role": "user", "content": prompt}]
    )

    return response["message"]["content"]