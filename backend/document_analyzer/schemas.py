from pydantic import BaseModel, Field
from typing import List, Literal, Dict, Any

DocType = Literal["Judgment", "Contract", "Legal Notice", "FIR", "Policy", "Unknown"]
RiskLevel = Literal["low", "medium", "high"]

class Citation(BaseModel):
    page: int
    chunk_id: str

class CitedText(BaseModel):
    text: str = "Not found"
    citations: List[Citation] = Field(default_factory=list)

class RedFlag(BaseModel):
    title: str
    risk_level: RiskLevel
    why_it_matters: str
    suggested_fix: str
    citations: List[Citation] = Field(default_factory=list)

class LegalReport(BaseModel):
    doc_id: str
    doc_type: DocType
    confidence: float = 0.0

    metadata: Dict[str, Any] = Field(default_factory=dict)
    structured_summary: Dict[str, Any] = Field(default_factory=dict)

    clauses: Dict[str, Any] = Field(default_factory=dict)
    red_flags: List[RedFlag] = Field(default_factory=list)
    missing_essentials: List[str] = Field(default_factory=list)
    #So internally it does:

    #metadata = dict()   # new empty dict every time

    #This avoids shared-state bugs.
    actionables: Dict[str, Any] = Field(default_factory=dict)

    disclaimer: str = (
        "This report is for informational purposes only and is not legal advice. "
        "Legal outcomes depend on full facts, evidence, and jurisdiction. "
        "Consider consulting a qualified lawyer."
    )