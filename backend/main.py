from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import base64
import cv2
import asyncio
import os
import sys
from datetime import datetime
from typing import List, Dict, Optional
from pathlib import Path

# Add ai-engine directory to Python path
sys.path.insert(0, str(Path(__file__).parent.parent / "ai-engine"))
try:
    from detection.yolo_detector import YOLODetector
    yolo_available = True
    print("✅ YOLO detector loaded successfully!")
except Exception as e:
    print(f"⚠️ YOLO not available: {e}")
    yolo_available = False

app = FastAPI(title="Sentinel AI - CCTV Intelligence System", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create data directories
os.makedirs("recordings", exist_ok=True)
os.makedirs("thumbnails", exist_ok=True)

# In-memory "database" for demo purposes
cameras_db = []
recordings_db = []
alerts_db = []
next_camera_id = 1
next_recording_id = 1
next_alert_id = 1

# Active streams tracking
active_streams: Dict[int, dict] = {}

# Initialize YOLO detector
detector = None
if yolo_available:
    try:
        detector = YOLODetector("yolov8n.pt", conf_threshold=0.5)
    except Exception as e:
        print(f"⚠️ Could not initialize YOLO: {e}")
        yolo_available = False

# Pydantic models
class CameraCreate(BaseModel):
    name: str
    rtsp_url: str
    location: Optional[str] = None

class Camera(BaseModel):
    id: int
    name: str
    rtsp_url: str
    location: Optional[str]
    is_active: bool
    created_at: datetime

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, camera_id: int):
        await websocket.accept()
        if camera_id not in self.active_connections:
            self.active_connections[camera_id] = []
        self.active_connections[camera_id].append(websocket)

    def disconnect(self, websocket: WebSocket, camera_id: int):
        if camera_id in self.active_connections and websocket in self.active_connections[camera_id]:
            self.active_connections[camera_id].remove(websocket)

    async def send_personal_message(self, message: dict, websocket: WebSocket):
        await websocket.send_json(message)

manager = ConnectionManager()

# --- Camera Management ---
@app.get("/api/cameras", response_model=List[Camera])
def get_cameras():
    return cameras_db

@app.post("/api/cameras", response_model=Camera)
def add_camera(camera: CameraCreate):
    global next_camera_id
    new_camera = {
        "id": next_camera_id,
        "name": camera.name,
        "rtsp_url": camera.rtsp_url,
        "location": camera.location,
        "is_active": False,
        "created_at": datetime.now()
    }
    cameras_db.append(new_camera)
    next_camera_id += 1
    return new_camera

@app.delete("/api/cameras/{camera_id}")
def delete_camera(camera_id: int):
    global cameras_db
    cameras_db = [c for c in cameras_db if c["id"] != camera_id]
    return {"message": "Camera deleted"}

@app.post("/api/cameras/{camera_id}/start")
async def start_camera(camera_id: int):
    camera = next((c for c in cameras_db if c["id"] == camera_id), None)
    if not camera:
        raise HTTPException(status_code=404, detail="Camera not found")
    camera["is_active"] = True
    return {"message": "Camera started", "camera": camera}

@app.post("/api/cameras/{camera_id}/stop")
async def stop_camera(camera_id: int):
    camera = next((c for c in cameras_db if c["id"] == camera_id), None)
    if not camera:
        raise HTTPException(status_code=404, detail="Camera not found")
    camera["is_active"] = False
    return {"message": "Camera stopped", "camera": camera}

# --- Alert Management ---
@app.get("/api/alerts")
def get_alerts():
    return alerts_db

# --- Live Stream ---
@app.websocket("/ws/stream/{camera_id}")
async def websocket_stream(websocket: WebSocket, camera_id: int):
    await manager.connect(websocket, camera_id)
    
    cap = None
    try:
        camera = next((c for c in cameras_db if c["id"] == camera_id), None)
        if not camera:
            return
        
        # For demo: if RTSP URL is "demo0" or "demo1", use sample videos
        video_source = camera["rtsp_url"]
        if video_source == "demo0":
            video_source = "https://www.w3schools.com/html/mov_bbb.mp4"
        elif video_source == "demo1":
            video_source = "https://www.w3schools.com/html/movie.mp4"
        
        cap = cv2.VideoCapture(video_source)
        if not cap.isOpened():
            print(f"Could not open camera {camera_id}")
            return
        
        print(f"Streaming camera {camera_id}: {camera['name']}")
        
        while True:
            ret, frame = cap.read()
            if not ret:
                # Loop demo videos
                if camera["rtsp_url"] in ["demo0", "demo1"]:
                    cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                continue
            
            # Detect people if YOLO is available
            person_count = 0
            display_frame = frame.copy()
            
            if detector and yolo_available:
                try:
                    detections = detector.detect(frame)
                    display_frame = detector.draw_detections(frame, detections)
                    person_count = len(detections)
                except Exception as e:
                    print(f"YOLO detection error: {e}")
            else:
                # Fallback simulation if YOLO not available
                person_count = 0
            
            # Draw people count
            cv2.putText(display_frame, f"People: {person_count}", (20, 50), 
                        cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 255, 0), 3)
            
            # Draw demo mode notice if YOLO not available
            if not yolo_available:
                cv2.putText(display_frame, "SIMULATED", (20, display_frame.shape[0] - 20), 
                            cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 165, 255), 2)
            
            # Encode frame
            _, buffer = cv2.imencode('.jpg', display_frame, [int(cv2.IMWRITE_JPEG_QUALITY), 60])
            frame_b64 = base64.b64encode(buffer).decode('utf-8')
            
            await manager.send_personal_message({
                "frame": frame_b64,
                "person_count": person_count,
                "camera_id": camera_id
            }, websocket)
            
            await asyncio.sleep(0.033)
            
    except WebSocketDisconnect:
        print(f"Client disconnected from camera {camera_id}")
        manager.disconnect(websocket, camera_id)
    except Exception as e:
        print(f"Stream error on camera {camera_id}: {str(e)}")
        manager.disconnect(websocket, camera_id)
    finally:
        if cap:
            cap.release()

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "yolo_available": yolo_available,
        "detector_initialized": detector is not None
    }

@app.get("/")
def root():
    return {
        "message": "Sentinel AI - CCTV Intelligence System",
        "version": "2.0.0",
        "yolo_enabled": yolo_available
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
