import requests
from bs4 import BeautifulSoup


def extract_clean_text(url):

    response = requests.get(url, timeout=10)

    soup = BeautifulSoup(response.text, "html.parser")

    paragraphs = soup.find_all("p")

    text = "\n".join([p.get_text().strip() for p in paragraphs])

    return text