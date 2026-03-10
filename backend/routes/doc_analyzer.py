import os, uuid, json
from fastapi import APIRouter, UploadFile, File, HTTPException

from backend.document_analyzer.pdf_extract import extract_pages, looks_scanned_or_empty
from backend.document_analyzer.chunking import chunk_pages
from backend.document_analyzer.embeddings import Embedder
from backend.document_analyzer.vector_store_faiss import FaissStore
from backend.document_analyzer.llm import OllamaLLM
from backend.document_analyzer.analyzer import DocumentAnalyzer

router = APIRouter(prefix="/doc", tags=["Document Analyzer"])

BASE_DIR = os.path.join(os.path.dirname(__file__), "..", "document_analyzer", "storage")
UPLOADS = os.path.join(BASE_DIR, "uploads")
INDICES = os.path.join(BASE_DIR, "indices")
META = os.path.join(BASE_DIR, "meta")
REPORTS = os.path.join(BASE_DIR, "reports")

for d in [UPLOADS, INDICES, META, REPORTS]:
    os.makedirs(d, exist_ok=True)

embedder = Embedder()
llm = OllamaLLM()  # uses default localhost + model

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    doc_id = str(uuid.uuid4())
    pdf_path = os.path.join(UPLOADS, f"{doc_id}.pdf")

    with open(pdf_path, "wb") as f:
        f.write(await file.read())

    return {"doc_id": doc_id}

@router.post("/index/{doc_id}")
def index_pdf(doc_id: str):
    pdf_path = os.path.join(UPLOADS, f"{doc_id}.pdf")
    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=404, detail="PDF not found")

    pages = extract_pages(pdf_path)
    if looks_scanned_or_empty(pages):
        raise HTTPException(status_code=400, detail="Scanned/empty text PDF. Enable OCR fallback to support this.")

    chunks = chunk_pages(pages)
    if not chunks:
        raise HTTPException(status_code=400, detail="No extractable text")

    vecs = embedder.embed([c["text"] for c in chunks])

    index_path = os.path.join(INDICES, f"{doc_id}.faiss")
    meta_path = os.path.join(META, f"{doc_id}.json")

    store = FaissStore(index_path=index_path, meta_path=meta_path)
    store.build(vecs, chunks)
    store.save()

    return {"doc_id": doc_id, "pages": len(pages), "chunks": len(chunks)}

@router.post("/analyze/{doc_id}")
def analyze_pdf(doc_id: str):
    index_path = os.path.join(INDICES, f"{doc_id}.faiss")
    meta_path = os.path.join(META, f"{doc_id}.json")
    if not (os.path.exists(index_path) and os.path.exists(meta_path)):
        raise HTTPException(status_code=400, detail="Index not found. Run /doc/index/{doc_id} first.")

    store = FaissStore(index_path=index_path, meta_path=meta_path)
    store.load()

    analyzer = DocumentAnalyzer(embedder=embedder, llm=llm, store=store)
    report = analyzer.run(doc_id)

    report_path = os.path.join(REPORTS, f"{doc_id}.json")
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(report.model_dump(), f, ensure_ascii=False, indent=2)

    return report.model_dump()

@router.get("/report/{doc_id}")
def get_report(doc_id: str):
    report_path = os.path.join(REPORTS, f"{doc_id}.json")
    if not os.path.exists(report_path):
        raise HTTPException(status_code=404, detail="Report not found. Run /doc/analyze/{doc_id} first.")
    with open(report_path, "r", encoding="utf-8") as f:
        return json.load(f)