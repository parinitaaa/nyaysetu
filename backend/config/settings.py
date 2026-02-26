# backend/config/settings.py

from pathlib import Path

# Base directory of backend
BASE_DIR = Path(__file__).resolve().parent.parent

# Knowledge Base Paths
KNOWLEDGE_BASE_DIR = BASE_DIR / "knowledge_base" / "know_your_rights"
INDEX_FILE = KNOWLEDGE_BASE_DIR / "index.json"

# App Settings
APP_NAME = "NyaySetu"
API_VERSION = "v1"

# Debug (can later come from env)
DEBUG = True