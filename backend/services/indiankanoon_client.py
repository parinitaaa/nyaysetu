import requests
from typing import Any, Dict, Optional
from config.settings import IK_API_BASE, IK_API_TOKEN

class IndianKanoonClient:
    """
    Thin client around Indian Kanoon API.
    Endpoints supported in docs: /search, /doc, /docfragment, /docmeta, /origdoc. :contentReference[oaicite:2]{index=2}
    """
    def __init__(self, timeout: int = 45):
        self.timeout = timeout

    def _headers(self) -> Dict[str, str]:
        if not IK_API_TOKEN:
            raise RuntimeError("IK_API_TOKEN is not set. Add it in backend/.env or system env.")
        return {
            "Authorization": f"Token {IK_API_TOKEN}",
            "Accept": "application/json",
        }

    def search(self, form_input: str, pagenum: int = 0, doctypes: Optional[str] = None,
               fromdate: Optional[str] = None, todate: Optional[str] = None,
               title: Optional[str] = None, cite: Optional[str] = None) -> Dict[str, Any]:
        params: Dict[str, Any] = {"formInput": form_input, "pagenum": pagenum}
        if doctypes: params["doctypes"] = doctypes
        if fromdate: params["fromdate"] = fromdate
        if todate: params["todate"] = todate
        if title: params["title"] = title
        if cite: params["cite"] = cite

        r = requests.get(f"{IK_API_BASE}/search/", headers=self._headers(), params=params, timeout=self.timeout)
        r.raise_for_status()
        return r.json()

    def docmeta(self, docid: str) -> Dict[str, Any]:
        r = requests.get(f"{IK_API_BASE}/docmeta/{docid}/", headers=self._headers(), timeout=self.timeout)
        r.raise_for_status()
        return r.json()

    def docfragment(self, docid: str, form_input: str) -> Dict[str, Any]:
        params = {"formInput": form_input}
        r = requests.get(f"{IK_API_BASE}/docfragment/{docid}/", headers=self._headers(), params=params, timeout=self.timeout)
        r.raise_for_status()
        return r.json()

    def doc(self, docid: str) -> Dict[str, Any]:
        r = requests.get(f"{IK_API_BASE}/doc/{docid}/", headers=self._headers(), timeout=self.timeout)
        r.raise_for_status()
        return r.json()