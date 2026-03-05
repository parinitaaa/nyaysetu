from typing import List, Dict
import fitz  # pymupdf

def extract_pages(pdf_path: str) -> List[Dict]:
    doc = fitz.open(pdf_path)
    pages = []
    for i in range(len(doc)):
        text = (doc[i].get_text("text") or "").strip()
        pages.append({"page": i + 1, "text": text})
    return pages

def looks_scanned_or_empty(pages: List[Dict], min_total_chars: int = 300) -> bool:
    total = sum(len(p["text"]) for p in pages)
    return total < min_total_chars