import requests
import xml.etree.ElementTree as ET


def get_procedure_links():

    sitemap_url = "https://nyaaya.org/legal_explainer-sitemap.xml"

    response = requests.get(sitemap_url, timeout=20)

    root = ET.fromstring(response.content)

    namespace = {"ns": "http://www.sitemaps.org/schemas/sitemap/0.9"}

    links = []

    for loc in root.findall("ns:url/ns:loc", namespace):
        links.append(loc.text)

    return links