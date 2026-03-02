import re
import torch
from PyPDF2 import PdfReader
from transformers import BartTokenizer, BartForConditionalGeneration

# =========================
# MODEL (loaded ONCE)
# =========================

MODEL_NAME = "facebook/bart-large-cnn"

tokenizer = BartTokenizer.from_pretrained(MODEL_NAME)
model = BartForConditionalGeneration.from_pretrained(MODEL_NAME)
model.eval()


# =========================
# PDF → TEXT
# =========================

def extract_text_from_pdf(file_path: str) -> str:
    reader = PdfReader(file_path)
    text = ""

    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + "\n"

    return text


# =========================
# TEXT CLEANING
# =========================

def clean_text(text: str) -> str:
    text = re.sub(r'\n+', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


# =========================
# CHUNKING
# =========================

def chunk_text(text: str, chunk_size: int = 400) -> list[str]:
    words = text.split()
    return [
        " ".join(words[i:i + chunk_size])
        for i in range(0, len(words), chunk_size)
    ]


# =========================
# SUMMARIZATION
# =========================

def summarize_chunk(chunk: str) -> str:
    inputs = tokenizer(
        chunk,
        return_tensors="pt",
        truncation=True,
        max_length=1024
    )

    with torch.no_grad():
        summary_ids = model.generate(
            inputs["input_ids"],
            max_length=150,
            min_length=50,
            num_beams=4,
            length_penalty=2.0,
            early_stopping=True
        )

    return tokenizer.decode(summary_ids[0], skip_special_tokens=True)


def summarize_pdf(file_path: str) -> str:
    raw_text = extract_text_from_pdf(file_path)
    cleaned_text = clean_text(raw_text)
    chunks = chunk_text(cleaned_text)

    summaries = []
    for chunk in chunks:
        summaries.append(summarize_chunk(chunk))

    return " ".join(summaries)