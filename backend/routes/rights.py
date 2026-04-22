# backend/routes/rights.py

from fastapi import APIRouter, HTTPException
from config.settings import KNOWLEDGE_BASE_DIR, INDEX_FILE
from utils.json_loader import load_json, JSONLoadError

router = APIRouter(prefix="/rights", tags=["Know Your Rights"])


@router.get("/categories")
def get_categories():
    """
    Get all rights categories.
    """
    try:
        index_data = load_json(INDEX_FILE)
        return index_data["categories"]
    except JSONLoadError as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{category_slug}")
def get_rights_by_category(category_slug: str):
    """
    Get all rights under a specific category.
    """
    try:
        index_data = load_json(INDEX_FILE)
    except JSONLoadError as e:
        raise HTTPException(status_code=500, detail=str(e))

    category = next(
        (c for c in index_data["categories"] if c["slug"] == category_slug),
        None
    )

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    rights = []
    for file_path in category["files"]:
        try:
            rights.append(
                load_json(KNOWLEDGE_BASE_DIR / file_path)
            )
        except JSONLoadError:
            continue

    return {
        "category": category["title"],
        "rights": rights
    }


@router.get("/{category_slug}/{right_slug}")
def get_single_right(category_slug: str, right_slug: str):
    """
    Get a single right by category and slug.
    """
    try:
        index_data = load_json(INDEX_FILE)
    except JSONLoadError as e:
        raise HTTPException(status_code=500, detail=str(e))

    category = next(
        (c for c in index_data["categories"] if c["slug"] == category_slug),
        None
    )

    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    for file_path in category["files"]:
        try:
            data = load_json(KNOWLEDGE_BASE_DIR / file_path)
            if data.get("slug") == right_slug:
                return data
        except JSONLoadError:
            continue

    raise HTTPException(status_code=404, detail="Right not found")