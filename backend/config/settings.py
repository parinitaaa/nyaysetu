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

import os

IK_API_BASE = os.getenv("IK_API_BASE", "https://api.indiankanoon.org")
IK_PUBLIC_BASE = os.getenv("IK_PUBLIC_BASE", "https://indiankanoon.org")
IK_API_TOKEN = os.getenv("IK_API_TOKEN", "")

# Debug (can later come from env)
DEBUG = True