import requests
from bs4 import BeautifulSoup


HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    "Accept-Language": "en-US,en;q=0.9",
}


def scrape_lawyers(city="bangalore", category="criminal"):

    url = f"https://lawrato.com/{category}-lawyers/{city}"

    response = requests.get(url, headers=HEADERS)
    soup = BeautifulSoup(response.text, "html.parser")

    lawyers = []

    cards = soup.find_all("div", class_="lawyer-item")

    for card in cards:

        # name
        name_tag = card.select_one("h2.media-heading span")
        name = name_tag.text.strip() if name_tag else "N/A"

        # profile link
        link_tag = card.select_one("a[href]")
        profile_link = link_tag["href"] if link_tag else ""

        # image
        img_tag = card.select_one("img.media-object")
        image = img_tag["src"] if img_tag else ""

        # location
        loc_tag = card.select_one(".location span")
        location = loc_tag.text.strip() if loc_tag else ""

        # experience
        exp_tag = card.select_one(".experience span")
        experience = exp_tag.text.strip() if exp_tag else ""

        # rating
        rating_tag = card.select_one(".score")
        rating = rating_tag.text.strip() if rating_tag else "N/A"

        # practice area
        skill_tag = card.select_one(".area-skill div")
        practice_area = skill_tag.text.strip() if skill_tag else ""

        lawyers.append({
            "name": name,
            "location": location,
            "experience": experience,
            "rating": rating,
            "practice_area": practice_area,
            "image": image,
            "profile_link": profile_link
        })

    return lawyers