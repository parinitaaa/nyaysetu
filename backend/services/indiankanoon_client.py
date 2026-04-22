import requests
from typing import Any, Dict, Optional
from config.settings import IK_API_BASE, IK_API_TOKEN

class IndianKanoonClient:
    def __init__(self, timeout: int = 45):
        self.timeout = timeout

    def _headers(self) -> Dict[str, str]:
        if not IK_API_TOKEN:
            raise RuntimeError("IK_API_TOKEN is not set.")
        return {
            "Authorization": f"Token {IK_API_TOKEN}",
            "Accept": "application/json",
        }

    def search(self, form_input: str, pagenum: int = 0, doctypes: Optional[str] = None,
               fromdate: Optional[str] = None, todate: Optional[str] = None,
               title: Optional[str] = None, cite: Optional[str] = None) -> Dict[str, Any]:
        data: Dict[str, Any] = {"formInput": form_input, "pagenum": pagenum}
        if doctypes: data["doctypes"] = doctypes
        if fromdate: data["fromdate"] = fromdate
        if todate: data["todate"] = todate
        if title: data["title"] = title
        if cite: data["cite"] = cite

        r = requests.post(f"{IK_API_BASE}/search/", headers=self._headers(), data=data, timeout=self.timeout)
        r.raise_for_status()
        return r.json()

    def doc(self, docid: str) -> Dict[str, Any]:
        r = requests.post(f"{IK_API_BASE}/doc/{docid}/", headers=self._headers(), timeout=self.timeout)
        r.raise_for_status()
        return r.json()

    def docmeta(self, docid: str) -> Dict[str, Any]:
        r = requests.post(f"{IK_API_BASE}/docmeta/{docid}/", headers=self._headers(), timeout=self.timeout)
        r.raise_for_status()
        return r.json()

    def docfragment(self, docid: str, form_input: str) -> Dict[str, Any]:
        r = requests.post(
            f"{IK_API_BASE}/docfragment/{docid}/",
            headers=self._headers(),
            data={"formInput": form_input},
            timeout=self.timeout
        )
        r.raise_for_status()
        return r.json()

    def origdoc(self, docid: str) -> Dict[str, Any]:
        r = requests.post(f"{IK_API_BASE}/origdoc/{docid}/", headers=self._headers(), timeout=self.timeout)
        r.raise_for_status()
        return r.json()