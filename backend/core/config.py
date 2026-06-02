from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    PROJECT_NAME: str = "Sentinel AI"
    API_V1_STR: str = "/api/v1"
    
    SECRET_KEY: str = "your-secret-key-change-in-production-please"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
    
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "sentinel"
    POSTGRES_PASSWORD: str = "sentinel123"
    POSTGRES_DB: str = "sentinel"
    
    MONGODB_URL: str = "mongodb://localhost:27017/"
    MONGODB_DB_NAME: str = "sentinel"
    
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    
    MINIO_ENDPOINT: str = "localhost:9000"
    MINIO_ACCESS_KEY: str = "minioadmin"
    MINIO_SECRET_KEY: str = "minioadmin"
    MINIO_BUCKET: str = "sentinel"
    MINIO_SECURE: bool = False
    
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    
    YOLO_MODEL_PATH: str = "ai-engine/models/yolov8n.pt"
    
    class Config:
        env_file = ".env"


settings = Settings()
