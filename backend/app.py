# backend/main.py
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import joblib
<<<<<<< HEAD
import re
from routes import case_search
from routes import doc_analyzer
from routes import rights
from routes import chatbot
=======

# Routers
from routes import rights, chatbot
from routes.lawyer_routes import router as lawyer_router

# Services
from chatbot.rag_pipeline import ask_question
>>>>>>> 3988d2a (lawyers near me feature)
from config.settings import APP_NAME, API_VERSION, DEBUG
from database import init_db

# from routes import rag_chatbot
from dotenv import load_dotenv

load_dotenv()


# =========================
# 1️⃣ Create FastAPI app
# =========================
def create_app() -> FastAPI:

    app = FastAPI(
        title=APP_NAME,
        version=API_VERSION,
        debug=DEBUG,
<<<<<<< HEAD
        description="Predicts case outcomes based on user-selected options",
=======
        description="NyaySetu Backend API",
>>>>>>> 3988d2a (lawyers near me feature)
    )

    @app.on_event("startup")
    async def startup():
        await init_db()

    # CORS (for frontend like React / Next.js later)
    app.add_middleware(
        CORSMiddleware,
<<<<<<< HEAD
        allow_origins=["*"],  # restrict later in production
=======
        allow_origins=["*"],
>>>>>>> 3988d2a (lawyers near me feature)
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

<<<<<<< HEAD
    # Register routes
    app.include_router(rights.router)
    app.include_router(chatbot.router)
    # app.include_router(rag_chatbot.router)
    app.include_router(doc_analyzer.router)
    app.include_router(case_search.router)
    # =========================
    # 2️⃣ Load model and vectorizer (from old GitHub version)
    # =========================
    model = joblib.load("models/case_outcome_model.pkl")
    vectorizer = joblib.load("models/tfidf_vectorizer.pkl")

    # =========================
    # 3️⃣ Load synthetic dataset (used for averages & dropdown options)
=======
    # =========================
    # Routers
    # =========================
    app.include_router(rights.router, prefix="/rights", tags=["Rights"])
    app.include_router(chatbot.router, prefix="/chatbot", tags=["Chatbot"])
    app.include_router(lawyer_router,prefix="/lawyers",tags=["Lawyers"])

    # =========================
    # Startup Event (LOAD ML ONCE)
    # =========================
    @app.on_event("startup")
    def load_ml_assets():

        print("✅ Loading ML models...")

        app.state.model = joblib.load("models/case_outcome_model.pkl")
        app.state.vectorizer = joblib.load("models/tfidf_vectorizer.pkl")
        app.state.df_cases = pd.read_csv("models/cases_data.csv")

        print("✅ ML models loaded")

    # =========================
    # Utility
>>>>>>> 3988d2a (lawyers near me feature)
    # =========================
    df_cases = pd.read_csv(
        "models/cases_data.csv"
    )  # save your df_cases as CSV after training

    # =========================
    # 4️⃣ Helper function to clean text
    # =========================
    def clean_text(text: str):
        text = str(text).lower()
        text = re.sub(r"[^a-z ]", " ", text)
        return re.sub(r"\s+", " ", text).strip()

    # =========================
<<<<<<< HEAD
    # 5️⃣ Endpoint: Get dropdown options
=======
    # Dropdown Options
>>>>>>> 3988d2a (lawyers near me feature)
    # =========================
    @app.get("/options", tags=["Prediction"])
    def get_options():

        df = app.state.df_cases

        return {
<<<<<<< HEAD
            "states": sorted(df_cases["state"].unique().tolist()),
            "court_types": sorted(df_cases["court_type"].unique().tolist()),
            "case_types": sorted(df_cases["case_type"].unique().tolist()),
=======
            "states": sorted(df["state"].unique()),
            "court_types": sorted(df["court_type"].unique()),
            "case_types": sorted(df["case_type"].unique()),
>>>>>>> 3988d2a (lawyers near me feature)
            "public_interest": ["Yes", "No"],
        }

    # =========================
<<<<<<< HEAD
    # 6️⃣ Endpoint: Predict case outcome
    # =========================
    @app.post("/predict")
    def predict_case(
        state: str = Query(..., description="State where case is filed"),
        court_type: str = Query(..., description="Court type"),
        case_type: str = Query(..., description="Type of case"),
        public_interest: str = Query("No", description="Public interest case Yes/No"),
    ):
        # Filter dataset for averages
        subset = df_cases[
            (df_cases["state"] == state)
            & (df_cases["court_type"] == court_type)
            & (df_cases["case_type"] == case_type)
        ]

        # If subset empty, fallback to full dataset
        if len(subset) == 0:
            subset = df_cases
=======
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
>>>>>>> 3988d2a (lawyers near me feature)

        avg_complexity = subset["complexity"].mean()
        avg_hearings = subset["hearings"].mean()

        # Generate text for model
        input_text = f"The {case_type} case with complexity {avg_complexity:.1f} and {avg_hearings:.0f} hearings"
        input_clean = clean_text(input_text)
        input_vec = vectorizer.transform([input_clean])

<<<<<<< HEAD
        prediction = model.predict(input_vec)[0]
        prob = model.predict_proba(input_vec)[0]
=======
        vec = vectorizer.transform([clean_text(input_text)])

        prediction = model.predict(vec)[0]
        probabilities = model.predict_proba(vec)[0]
>>>>>>> 3988d2a (lawyers near me feature)

        return {
            "prediction": {
                "outcome": "Favorable (Decided)"
                if prediction == 1
                else "Unfavorable (Pending)",
<<<<<<< HEAD
                "confidence": round(float(max(prob)) * 100, 2),
                "favorable_probability": round(float(prob[1]) * 100, 2),
            },
            "inputs": {
                "state": state,
                "court_type": court_type,
                "case_type": case_type,
                "public_interest": public_interest,
                "avg_complexity": round(avg_complexity, 1),
                "avg_hearings": int(avg_hearings),
            },
        }

    # =========================
    # 7️⃣ Root endpoint
=======
                "confidence": round(float(max(probabilities)) * 100, 2),
                "favorable_probability": round(
                    float(probabilities[1]) * 100, 2
                ),
            }
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
    # Health Check
>>>>>>> 3988d2a (lawyers near me feature)
    # =========================
    @app.get("/", tags=["Health"])
    def root():
<<<<<<< HEAD
        return {"app": APP_NAME, "version": API_VERSION, "status": "running"}
=======
        return {"status": "NyaySetu Backend Running"}
>>>>>>> 3988d2a (lawyers near me feature)

    return app


# =========================
<<<<<<< HEAD
# 8️⃣ Initialize app
=======
# App Instance
>>>>>>> 3988d2a (lawyers near me feature)
# =========================
app = create_app()
