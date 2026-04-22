import os
import requests
import json
from dotenv import load_dotenv
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

class LLMService:
    def __init__(self):
        if not GROQ_API_KEY:
            raise RuntimeError("GROQ_API_KEY is not set in your .env")
        self.api_key = GROQ_API_KEY
        self.model = "llama-3.1-8b-instant"   # fast + free

    def _call(self, system: str, prompt: str) -> str:
        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            },
            json={
                "model": self.model,
                "messages": [
                    {"role": "system", "content": system},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.1,
                "max_tokens": 1000
            },
            timeout=30
        )
        response.raise_for_status()
        return response.json()["choices"][0]["message"]["content"]

    def generate_text(self, system: str, prompt: str) -> str:
        return self._call(system, prompt)

    def generate_json(self, system: str, prompt: str) -> dict:
        output = self._call(system, prompt)
        # Strip markdown code fences if Groq wraps in ```json ... ```
        cleaned = output.strip().removeprefix("```json").removeprefix("```").removesuffix("```").strip()
        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            return {"raw_output": output}