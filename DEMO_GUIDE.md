# 🚨 Sentinel AI Demo Guide

Welcome to the Sentinel AI CCTV Intelligence System Demo!

---

## 🔧 Setup & Running the System

### 1. Start the Backend (API + Streaming)
The backend is currently running on http://localhost:8000
- Open a terminal, go to the `backend/` folder
- Run: `python main.py`
- Confirm backend is running at http://localhost:8000

### 2. Start the Frontend (Dashboard)
The frontend is already running on http://localhost:3000
- Open another terminal, go to the `frontend/` folder
- Run: `npm run dev`

### 3. Open the Dashboard
Open your browser and navigate to http://localhost:3000!

---

## 📱 Dashboard Overview

The dashboard has:
- **Sidebar**: Navigation to different sections
- **Stats Cards**: Quick glance at active cameras, alerts, etc.
- **Charts**: Activity and threat level visualizations
- **Live Cameras Preview**: Quick access to camera feeds
- **Recent Alerts**: List of latest security events

---

## 🎥 Live Camera View (Key Demo Feature!)

Click **Live Cameras** in the sidebar!

You'll see:
1. Live streaming video from Demo Cameras 1 & 2
2. Live people count (will show detections when YOLO model is loaded)
3. Camera selector panel to switch between feeds

---

## 🎯 Adding Real Cameras (RTSP/Webcam)

To connect your own cameras:

### Option A: Webcam
In `backend/main.py`, change camera 0's URL to 0:
```python
cameras = {
    0: {"name": "My Webcam", "url": 0, "active": True},
    1: {"name": "Demo Camera", "url": "demo", "active": True}
}
```

### Option B: RTSP IP Camera
Update the URL in `backend/main.py`:
```python
cameras = {
    0: {"name": "My IP Camera", "url": "rtsp://username:password@192.168.1.100:554/stream1", "active": True},
    1: {"name": "Demo Camera", "url": "demo", "active": True}
}
```

---

## 🧠 Enabling AI Person Detection

To enable real person detection (not just demo frames):
1. Ensure the `ultralytics`, `opencv-python` packages are installed:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
2. In `backend/main.py`, uncomment the YOLO model loading and detection code.

---

## 📊 Features in Detail

### ✅ What's Working Right Now
- Beautiful dark-themed security dashboard
- WebSocket-based low-latency streaming
- Camera switching and management
- Stats and charts visualization
- Responsive design

### 🚧 Features to Extend Later
- Real-time facial recognition
- Suspicious behavior analysis
- Threat scoring
- Email/SMS alerting
- Person re-identification across cameras
- Incident clip saving

---

## 🔍 Demo Script for Tomorrow

When demoing to others, follow this script:

1. **Show Dashboard**: Open the main page and walk through the UI
2. **Live Cameras**: Go to Live View, switch between cameras
3. **Explain Architecture**: Backend (FastAPI) ↔ Frontend (Next.js)
4. **Camera Integration**: Show how easy it is to add real cameras
5. **Future Plans**: Mention the AI features coming soon!

---

## 📝 Quick Notes

- If ports are in use, change them in `backend/main.py` or `frontend/package.json`
- The system uses modern tech (FastAPI, Next.js, WebSockets) for performance and scalability
- All code is clean, modular, and follows best practices

---

Good luck with your demo! 🎉
