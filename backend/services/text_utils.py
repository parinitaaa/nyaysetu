import re
from html import unescape

_TAG_RE = re.compile(r"<[^>]+>")

def html_to_text(html: str) -> str:
    if not html:
        return ""
    html = unescape(html)
    text = _TAG_RE.sub(" ", html)
    text = re.sub(r"\s+", " ", text).strip()
    return text