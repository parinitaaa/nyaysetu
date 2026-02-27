# backend/chatbot/ingest.py

import json
from pathlib import Path
from langchain_core.documents import Document
from langchain_ollama import OllamaEmbeddings
from langchain_chroma import Chroma

BASE_DIR = Path(__file__).resolve().parent

DATA_PATH = BASE_DIR / "../knowledge_base/chatbot_data/legal_chatbot_data.json"
DB_PATH = BASE_DIR / "chroma_db"

with open(DATA_PATH, "r", encoding="utf-8") as f:
    data = json.load(f)

documents = []

for item in data:
    text = f"""
Question: {item['question']}
Answer: {item['answer']}
Category: {item['category']}
Keywords: {', '.join(item['keywords'])}
"""
    documents.append(
        Document(
            page_content=text.strip(),
            metadata={
                "category": item["category"],
                "question_id": item["question_id"]
            }
        )
    )

embeddings = OllamaEmbeddings(model="mxbai-embed-large")

db = Chroma.from_documents(
    documents=documents,
    embedding=embeddings,
    persist_directory=str(DB_PATH)
)

print("✅ ChromaDB created and persisted automatically")