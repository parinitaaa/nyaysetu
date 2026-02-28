# backend/rag.py

import json
import faiss
import numpy as np
from sentence_transformers import SentenceTransformer
import ollama

# Load your dataset
with open("knowledge_base/chatbot_data/legal_chatbot_data.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Combine question + answer for better embeddings
texts = [item["question"] + " " + item["answer"] for item in data]

# Sentence Transformer for embeddings
embed_model = SentenceTransformer("all-MiniLM-L6-v2")
embeddings = embed_model.encode(texts, convert_to_numpy=True)

# FAISS index
dimension = embeddings.shape[1]
index = faiss.IndexFlatL2(dimension)
index.add(embeddings)


def ask_question(question: str):
    # 1️⃣ Embed the query
    q_emb = embed_model.encode([question], convert_to_numpy=True)
    D, I = index.search(q_emb, k=3)

    # 2️⃣ Build context
    context = "\n".join([
        f"Q: {data[i]['question']}\nA: {data[i]['answer']}"
        for i in I[0]
    ])

    # 3️⃣ Prompt
    prompt = f"""
You are a legal assistant AI. Answer using ONLY the context below.

Context:
{context}

User Question: {question}
Answer clearly and simply:
"""

    # 4️⃣ Call Ollama
    response = ollama.chat(
        model="llama2",
        messages=[{"role": "user", "content": prompt}]
    )

    # 5️⃣ Extract answer safely
    return response["message"]["content"]