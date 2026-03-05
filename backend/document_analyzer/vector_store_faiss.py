from typing import List, Dict
import os, json
import numpy as np
import faiss

class FaissStore:
    def __init__(self, index_path: str, meta_path: str):
        self.index_path = index_path
        self.meta_path = meta_path
        self.index = None
        self.meta: List[Dict] = []

    def build(self, embeddings: np.ndarray, meta: List[Dict]):
        dim = embeddings.shape[1]
        self.index = faiss.IndexFlatIP(dim)  # cosine if embeddings normalized
        self.index.add(embeddings)
        self.meta = meta

    def save(self):
        os.makedirs(os.path.dirname(self.index_path), exist_ok=True)
        os.makedirs(os.path.dirname(self.meta_path), exist_ok=True)
        faiss.write_index(self.index, self.index_path)
        with open(self.meta_path, "w", encoding="utf-8") as f:
            json.dump(self.meta, f, ensure_ascii=False, indent=2)

    def load(self):
        self.index = faiss.read_index(self.index_path)
        with open(self.meta_path, "r", encoding="utf-8") as f:
            self.meta = json.load(f)

    def search(self, query_vec: np.ndarray, top_k: int = 7) -> List[Dict]:
        scores, ids = self.index.search(query_vec, top_k)
        out = []
        for score, idx in zip(scores[0].tolist(), ids[0].tolist()):
            if idx == -1:
                continue
            m = self.meta[idx]
            out.append({
                "score": float(score),
                "page": m["page"],
                "chunk_id": m["chunk_id"],
                "text": m["text"]
            })
        return out