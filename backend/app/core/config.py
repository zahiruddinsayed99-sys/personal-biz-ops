from pydantic_settings import BaseSettings, SettingsConfigDict
import os
from pathlib import Path

# Get the directory of the current file
# and move up to the root directory
ROOT_DIR = Path(__file__).resolve().parent.parent.parent.parent
env_path = ROOT_DIR / ".env"

class Settings(BaseSettings):
    APP_NAME: str = "BusinessHub AI"
    APP_ENV: str = "development"
    DEBUG: bool = True
    API_V1_STR: str = "/api/v1"

    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    POSTGRES_HOST: str
    POSTGRES_PORT: int
    DATABASE_URL: str

    model_config = SettingsConfigDict(env_file=str(env_path), env_file_encoding="utf-8", extra="ignore")

settings = Settings()
