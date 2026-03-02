# backend/app.py

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import os
import re
import shutil
import pandas as pd
import joblib

from routes import rights, chatbot
from chatbot.rag_pipeline import ask_question
from config.settings import APP_NAME, API_VERSION, DEBUG
from pdfanalyzer.pdf_summarizer import summarize_pdf


# =========================
# App Factory
# =========================

def create_app() -> FastAPI:
    app = FastAPI(
        title=APP_NAME,
        version=API_VERSION,
        debug=DEBUG,
        description="NyaySetu Backend API"
    )

    # =========================
    # CORS
    # =========================
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # restrict in production
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # =========================
    # Routers
    # =========================
    app.include_router(rights.router)
    app.include_router(chatbot.router)

    # =========================
    # Load ML assets
    # =========================
    model = joblib.load("models/case_outcome_model.pkl")
    vectorizer = joblib.load("models/tfidf_vectorizer.pkl")
    df_cases = pd.read_csv("models/cases_data.csv")

    # =========================
    # Utilities
    # =========================
    def clean_text(text: str) -> str:
        text = str(text).lower()
        text = re.sub(r"[^a-z ]", " ", text)
        return re.sub(r"\s+", " ", text).strip()

    # =========================
    # Dropdown options
    # =========================
    @app.get("/options")
    def get_options():
        return {
            "states": sorted(df_cases["state"].unique()),
            "court_types": sorted(df_cases["court_type"].unique()),
            "case_types": sorted(df_cases["case_type"].unique()),
            "public_interest": ["Yes", "No"],
        }

    # =========================
    # Case Outcome Prediction
    # =========================
    class PredictRequest(BaseModel):
        state: str
        court_type: str
        case_type: str
        public_interest: str = "No"

    @app.post("/predict")
    def predict_case(request: PredictRequest):
        subset = df_cases[
            (df_cases["state"] == request.state)
            & (df_cases["court_type"] == request.court_type)
            & (df_cases["case_type"] == request.case_type)
        ]

        if subset.empty:
            subset = df_cases

        avg_complexity = subset["complexity"].mean()
        avg_hearings = subset["hearings"].mean()

        input_text = (
            f"The {request.case_type} case with complexity "
            f"{avg_complexity:.1f} and {avg_hearings:.0f} hearings"
        )

        vec = vectorizer.transform([clean_text(input_text)])
        prediction = model.predict(vec)[0]
        probabilities = model.predict_proba(vec)[0]

        return {
            "prediction": {
                "outcome": "Favorable (Decided)" if prediction == 1 else "Unfavorable (Pending)",
                "confidence": round(float(max(probabilities)) * 100, 2),
                "favorable_probability": round(float(probabilities[1]) * 100, 2),
            }
        }

    # =========================
    # RAG Chatbot
    # =========================
    class ChatRequest(BaseModel):
        question: str

    @app.post("/chat")
    def chat(request: ChatRequest):
        return {
            "question": request.question,
            "answer": ask_question(request.question),
        }

    # =========================
    # PDF Summarizer
    # =========================
    UPLOAD_DIR = "temp"
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    @app.post("/summarize-pdf")
    async def summarize_pdf_endpoint(file: UploadFile = File(...)):
        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF files are allowed")

        file_path = os.path.join(UPLOAD_DIR, file.filename)

        try:
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            summary = summarize_pdf(file_path)

            return {
                "filename": file.filename,
                "summary": summary,
            }

        finally:
            # Always clean up temp file
            if os.path.exists(file_path):
                os.remove(file_path)

    # =========================
    # Health Check
    # =========================
    @app.get("/")
    def root():
        return {"status": "running"}

    return app


# =========================
# App instance
# =========================
app = create_app()