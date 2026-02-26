# backend/utils/json_loader.py

import json
from pathlib import Path


class JSONLoadError(Exception):
    """Custom exception for JSON loading errors"""
    pass


def load_json(file_path: Path) -> dict:
    """
    Safely load a JSON file.
    """
    if not file_path.exists():
        raise JSONLoadError(f"File not found: {file_path}")

    try:
        with open(file_path, "r", encoding="utf-8") as file:
            return json.load(file)
    except json.JSONDecodeError as e:
        raise JSONLoadError(f"Invalid JSON in {file_path}: {str(e)}")


def list_json_files(folder_path: Path) -> list:
    """
    Return all JSON files in a folder.
    """
    if not folder_path.exists():
        return []

    return [file for file in folder_path.iterdir() if file.suffix == ".json"]