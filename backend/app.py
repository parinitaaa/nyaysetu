# backend/app.py

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import os
import re
import shutil
import pandas as pd
import joblib

# Routers
from routes import rights, chatbot
from routes.lawyer_routes import router as lawyer_router

from routes import doc_analyzer, case_search
from database import init_db

# Services
from chatbot.rag_pipeline import ask_question
from config.settings import APP_NAME, API_VERSION, DEBUG
from pdfanalyzer.pdf_summarizer import summarize_pdf

# =========================
# 1️⃣ Create FastAPI app
# =========================
def create_app() -> FastAPI:

    app = FastAPI(
        title=APP_NAME,
        version=API_VERSION,
        debug=DEBUG,
        description="NyaySetu Backend API",
    )

    @app.on_event("startup")
    async def startup():
        await init_db()

    # CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # =========================
    # Routers
    # =========================
    app.include_router(rights.router, prefix="/rights", tags=["Rights"])
   # app.include_router(chatbot.router, prefix="/chatbot", tags=["Chatbot"])
    app.include_router(doc_analyzer.router, prefix="/docs", tags=["Document Analyzer"])
    app.include_router(case_search.router, prefix="/cases", tags=["Case Search"])
    app.include_router(lawyer_router, prefix="/lawyers", tags=["Lawyers"])

    # =========================
    # Startup Event (DB + ML)
    # =========================
    @app.on_event("startup")
    async def startup():

        await init_db()

        print("✅ Loading ML models...")

        app.state.model = joblib.load("models/case_outcome_model.pkl")
        app.state.vectorizer = joblib.load("models/tfidf_vectorizer.pkl")
        app.state.df_cases = pd.read_csv("models/cases_data.csv")

        print("✅ ML models loaded")

    # =========================
    df_cases = pd.read_csv("models/cases_data.csv")

    # =========================
    # Helper function
    # =========================
    def clean_text(text: str):
        text = str(text).lower()
        text = re.sub(r"[^a-z ]", " ", text)
        return re.sub(r"\s+", " ", text).strip()

    # =========================
    # Dropdown Options
    # =========================
    @app.get("/options", tags=["Prediction"])
    def get_options():

        df = app.state.df_cases

        return {
            "states": sorted(df["state"].unique()),
            "court_types": sorted(df["court_type"].unique()),
            "case_types": sorted(df["case_type"].unique()),
            "public_interest": ["Yes", "No"],
        }

    # =========================
    # Case Prediction
    # =========================
    class PredictRequest(BaseModel):
        state: str
        court_type: str
        case_type: str
        public_interest: str = "No"

    @app.post("/predict", tags=["Prediction"])
    def predict_case(request: PredictRequest):

        df = app.state.df_cases
        model = app.state.model
        vectorizer = app.state.vectorizer

        subset = df[
            (df["state"] == request.state)
            & (df["court_type"] == request.court_type)
            & (df["case_type"] == request.case_type)
        ]

        if subset.empty:
            subset = df

        avg_complexity = subset["complexity"].mean()
        avg_hearings = subset["hearings"].mean()

        input_text = f"The {request.case_type} case with complexity {avg_complexity:.1f} and {avg_hearings:.0f} hearings"
        input_clean = clean_text(input_text)
        vec = vectorizer.transform([input_clean])



        prediction = model.predict(vec)[0]
        probabilities = model.predict_proba(vec)[0]

        return {
            "prediction": {
                "outcome": "Favorable (Decided)" if prediction == 1 else "Unfavorable (Pending)",
                "confidence": round(float(max(probabilities)) * 100, 2),
                "favorable_probability": round(float(probabilities[1]) * 100, 2),
            },
            
        }

    # =========================
    # RAG Chatbot
    # =========================
    class ChatRequest(BaseModel):
        question: str

    @app.post("/chat", tags=["Chatbot"])
    def chat(request: ChatRequest):

        answer = ask_question(request.question)

        return {
            "question": request.question,
            "answer": answer,
        }

    # =========================
    # PDF Summarizer
    # =========================
    UPLOAD_DIR = "temp"
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    @app.post("/summarize-pdf", tags=["PDF Analyzer"])
    async def summarize_pdf_endpoint(file: UploadFile = File(...)):

        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(
                status_code=400,
                detail="Only PDF files allowed",
            )

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
            if os.path.exists(file_path):
                os.remove(file_path)

    # =========================
    # Root
    # =========================
    @app.get("/", tags=["Health"])
    def root():
        return {"status": "NyaySetu Backend Running"}

    return app


# =========================
# App Instance
# =========================
app = create_app()