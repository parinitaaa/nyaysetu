# backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import pandas as pd
import joblib
import re

from routes import rights
from routes import chatbot  # if you already have other chatbot routes
from routes.chatbot import router as chatbot_router
from chatbot.rag_pipeline import ask_question
from config.settings import APP_NAME, API_VERSION, DEBUG

# =========================
# 1️⃣ Create FastAPI app
# =========================
def create_app() -> FastAPI:
    app = FastAPI(
        title=APP_NAME,
        version=API_VERSION,
        debug=DEBUG,
        description="NyaySetu Backend API"
    )

    # =========================
    # 2️⃣ CORS
    # =========================
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # restrict in prod
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # =========================
    # 3️⃣ Register existing routes
    # =========================
    app.include_router(rights.router)
    app.include_router(chatbot.router)

    # =========================
    # 4️⃣ Load ML model + vectorizer
    # =========================
    model = joblib.load("models/case_outcome_model.pkl")
    vectorizer = joblib.load("models/tfidf_vectorizer.pkl")

    # =========================
    # 5️⃣ Load dataset
    # =========================
    df_cases = pd.read_csv("models/cases_data.csv")

    # =========================
    # 6️⃣ Helper: clean text
    # =========================
    def clean_text(text: str):
        text = str(text).lower()
        text = re.sub(r"[^a-z ]", " ", text)
        return re.sub(r"\s+", " ", text).strip()

    # =========================
    # 7️⃣ Dropdown options
    # =========================
    @app.get("/options")
    def get_options():
        return {
            "states": sorted(df_cases["state"].unique().tolist()),
            "court_types": sorted(df_cases["court_type"].unique().tolist()),
            "case_types": sorted(df_cases["case_type"].unique().tolist()),
            "public_interest": ["Yes", "No"]
        }

    # =========================
    # 8️⃣ Case outcome prediction
    # =========================
    class PredictRequest(BaseModel):
        state: str
        court_type: str
        case_type: str
        public_interest: str = "No"

    @app.post("/predict")
    def predict_case(request: PredictRequest):
        subset = df_cases[
            (df_cases["state"] == request.state) &
            (df_cases["court_type"] == request.court_type) &
            (df_cases["case_type"] == request.case_type)
        ]

        if subset.empty:
            subset = df_cases

        avg_complexity = subset["complexity"].mean()
        avg_hearings = subset["hearings"].mean()

        input_text = (
            f"The {request.case_type} case with complexity "
            f"{avg_complexity:.1f} and {avg_hearings:.0f} hearings"
        )

        input_vec = vectorizer.transform([clean_text(input_text)])

        prediction = model.predict(input_vec)[0]
        prob = model.predict_proba(input_vec)[0]

        return {
            "prediction": {
                "outcome": "Favorable (Decided)" if prediction == 1 else "Unfavorable (Pending)",
                "confidence": round(float(max(prob)) * 100, 2),
                "favorable_probability": round(float(prob[1]) * 100, 2)
            },
            "inputs": {
                "state": request.state,
                "court_type": request.court_type,
                "case_type": request.case_type,
                "public_interest": request.public_interest,
                "avg_complexity": round(avg_complexity, 1),
                "avg_hearings": int(avg_hearings)
            }
        }

     # =========================
     # 9️⃣ RAG CHATBOT (FAISS + LLAMA)
     # =========================
    class ChatRequest(BaseModel):
     question: str

    @app.post("/chat")
    def chat(request: ChatRequest):
       answer = ask_question(request.question)

       return {
         "question": request.question,
         "answer": answer
        }

    # =========================
    # 🔟 Root
    # =========================
    @app.get("/")
    def root():
        return {"status": "running"}

    return app


# =========================
# 1️⃣1️⃣ App instance
# =========================
app = create_app()