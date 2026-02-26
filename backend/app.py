# backend/main.py
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import joblib
import re

# =========================
# 1️⃣ Initialize FastAPI
# =========================
app = FastAPI(
    title="Case Prediction API",
    description="Predicts case outcomes based on user-selected options",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow all frontend domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# 2️⃣ Load model and vectorizer
# =========================
model = joblib.load("models/case_outcome_model.pkl")
vectorizer = joblib.load("models/tfidf_vectorizer.pkl")

# =========================
# 3️⃣ Load synthetic dataset (used for averages & dropdown options)
# =========================
df_cases = pd.read_csv("models/cases_data.csv")  # save your df_cases as CSV after training
# Columns: ['state', 'court_type', 'case_type', 'judge_rating', 'complexity', 'hearings', 'public_interest', 'case_text', 'outcome']

# =========================
# 4️⃣ Helper function to clean text
# =========================
def clean_text(text: str):
    text = str(text).lower()
    text = re.sub(r"[^a-z ]", " ", text)
    return re.sub(r"\s+", " ", text).strip()

# =========================
# 5️⃣ Endpoint: Get dropdown options
# =========================
@app.get("/options")
def get_options():
    return {
        "states": sorted(df_cases['state'].unique().tolist()),
        "court_types": sorted(df_cases['court_type'].unique().tolist()),
        "case_types": sorted(df_cases['case_type'].unique().tolist()),
        "public_interest": ['Yes','No']
    }

# =========================
# 6️⃣ Endpoint: Predict case outcome
# =========================
@app.post("/predict")
def predict_case(
    state: str = Query(..., description="State where case is filed"),
    court_type: str = Query(..., description="Court type"),
    case_type: str = Query(..., description="Type of case"),
    public_interest: str = Query("No", description="Public interest case Yes/No")
):
    # Filter dataset for averages
    subset = df_cases[
        (df_cases['state'] == state) &
        (df_cases['court_type'] == court_type) &
        (df_cases['case_type'] == case_type)
    ]

    # If subset empty, fallback to full dataset
    if len(subset) == 0:
        subset = df_cases

    avg_complexity = subset['complexity'].mean()
    avg_hearings = subset['hearings'].mean()

    # Generate text for model
    input_text = f"The {case_type} case with complexity {avg_complexity:.1f} and {avg_hearings:.0f} hearings"
    input_clean = clean_text(input_text)
    input_vec = vectorizer.transform([input_clean])

    prediction = model.predict(input_vec)[0]
    prob = model.predict_proba(input_vec)[0]

    return {
        "prediction": {
            "outcome": "Favorable (Decided)" if prediction == 1 else "Unfavorable (Pending)",
            "confidence": round(float(max(prob)) * 100, 2),
            "favorable_probability": round(float(prob[1]) * 100, 2)
        },
        "inputs": {
            "state": state,
            "court_type": court_type,
            "case_type": case_type,
            "public_interest": public_interest,
            "avg_complexity": round(avg_complexity,1),
            "avg_hearings": int(avg_hearings)
        }
    }

# =========================
# 7️⃣ Root
# =========================
@app.get("/")
def root():
    return {"message": "Case Prediction API is running", "version": "1.0"}