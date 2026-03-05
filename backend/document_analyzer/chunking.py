from typing import List, Dict

def chunk_pages(pages: List[Dict], chunk_size: int = 900, overlap: int = 150) -> List[Dict]:
    chunks = []
    for p in pages:
        text = p["text"]
        page = p["page"]
        if not text:
            continue

        start = 0
        local_idx = 0
        while start < len(text):
            end = min(start + chunk_size, len(text))
            chunk_text = text[start:end].strip()
            if chunk_text:
                local_idx += 1
                chunks.append({
                    "chunk_id": f"p{page}_c{local_idx}",
                    "page": page,
                    "text": chunk_text
                })
            if end == len(text):
                break
            start = max(0, end - overlap)
  # eg chunk_size = 900
  #overlap = 150 keeps continuity
    return chunks