import json
import requests
from typing import Any, Dict

class OllamaLLM:
    def __init__(self, base_url: str = "http://localhost:11434", model: str = "llama3.1:8b-instruct-q4_K_M"):
        self.base_url = base_url.rstrip("/")
        self.model = model

    def generate_json(self, system: str, user: str, timeout: int = 600) -> Dict[str, Any]:
        prompt = f"""{system}

Return ONLY valid JSON. No markdown. No explanations.

USER:
{user}
"""
        r = requests.post(
            f"{self.base_url}/api/generate",
            json={"model": self.model, "prompt": prompt, "stream": False},
            timeout=timeout
        )
        r.raise_for_status()
        text = r.json().get("response", "").strip()
        return json.loads(text)