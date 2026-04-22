from fastapi import APIRouter
from schemas.lawyer_schema import LawyerSearch
from services.lawrato_scraper import scrape_lawyers

router = APIRouter(prefix="/lawyers", tags=["Lawyers"])


@router.post("/search")
def search_lawyers(data: LawyerSearch):

    lawyers = scrape_lawyers(
        city=data.city.lower(),
        category=data.category.lower()
    )

    return {
        "total_found": len(lawyers),
        "lawyers": lawyers
    }