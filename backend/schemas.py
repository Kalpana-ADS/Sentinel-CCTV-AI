from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class CameraCreate(BaseModel):
    name: str
    rtsp_url: str
    location: Optional[str] = None

class Camera(BaseModel):
    id: int
    name: str
    rtsp_url: str
    location: Optional[str] = None
    is_active: bool
    created_at: datetime

    class Config:
        orm_mode = True

class Recording(BaseModel):
    id: int
    camera_id: int
    file_path: str
    start_time: datetime
    end_time: Optional[datetime] = None
    created_at: datetime

    class Config:
        orm_mode = True

class AlertType(str):
    pass

class Alert(BaseModel):
    id: int
    camera_id: int
    alert_type: str
    description: str
    confidence: float
    timestamp: datetime
    is_viewed: bool
    created_at: datetime

    class Config:
        orm_mode = True
