# backend/chatbot/embeddings.py

import json
import faiss
from sentence_transformers import SentenceTransformer
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "../knowledge_base/chatbot_data/legal_chatbot_data.json"

#  module-level cache (VERY IMPORTANT)
_index = None
_model = None
_data = None


def build_index():
    print("Loading embedding model...")
    model = SentenceTransformer(
        "all-MiniLM-L6-v2",
        device="cpu"
    )

    with open(DATA_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    texts = [
        f"Question: {item['question']}\nAnswer: {item['answer']}"
        for item in data
    ]

    print(f"Encoding {len(texts)} documents...")
    embeddings = model.encode(
        texts,
        convert_to_numpy=True,
        batch_size=16,
        show_progress_bar=True
    )

    print("Building FAISS index...")
    index = faiss.IndexFlatL2(embeddings.shape[1])
    index.add(embeddings)

    print("Index ready")
    return index, model, data


def get_index():
    global _index, _model, _data

    if _index is None:
        _index, _model, _data = build_index()

    return _index, _model, _data