# 🛡️ Sentinel AI - CCTV Intelligence System

[![GitHub stars](https://img.shields.io/github/stars/Kalpana-ADS/Sentinel-CCTV-AI?style=social)](https://github.com/Kalpana-ADS/Sentinel-CCTV-AI)

A modern, full-stack AI-powered CCTV surveillance system for real-time video monitoring, people counting, and security alerts!

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 18+
- OpenCV (usually included with Python packages)

### Step 1: Start the Backend
Open **Terminal 1**:
```bash
cd "c:\Users\Dell\Downloads\CCTV system AI\CCTV system\backend"
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Step 2: Start the Frontend
Open **Terminal 2**:
```bash
cd "c:\Users\Dell\Downloads\CCTV system AI\CCTV system\frontend"
npm run dev
```

### Step 3: Open the App!
Visit **http://localhost:3000** in your browser!

---

## 📷 How to Connect a Real CCTV Camera

### 1. Get Your RTSP URL
Most IP cameras use RTSP (Real‑Time Streaming Protocol). The URL format is usually:
```
rtsp://<username>:<password>@<camera-ip>:<port>/<stream-path>
```

Common examples by brand:
- **Hikvision**: `rtsp://admin:password@192.168.1.64:554/Streaming/Channels/101`
- **Dahua**: `rtsp://admin:password@192.168.1.108:554/cam/realmonitor?channel=1&subtype=0`
- **Axis**: `rtsp://root:pass@192.168.1.90/axis-media/media.amp`

### 2. Add the Camera in the App
1. Open **http://localhost:3000/cameras**
2. Fill in the form:
   - Camera Name: (e.g., "Front Door")
   - Location: (e.g., "Main Entrance")
   - RTSP URL: (paste your camera's RTSP URL)
3. Click "Add Camera"!

### 3. Try Demo Cameras First!
If you don't have a real camera yet:
- Use `demo0` as the RTSP URL for a nature sample video
- Use `demo1` as the RTSP URL for another sample video

---

## 📱 Features

✅ **Live CCTV View**: Real‑time streaming from multiple cameras
✅ **Camera Management**: Add, delete, start, stop cameras easily
✅ **Modern Dashboard**: Beautiful dark‑theme security interface
✅ **YOLO People Detection**: Real‑time person counting with bounding boxes
✅ **Demo Mode**: Test without real cameras
✅ **REST API**: Full API for integration
✅ **WebSocket Streaming**: Low‑latency live video

---

## 📂 Project Structure

```
CCTV system/
├── backend/             # FastAPI backend
│   └── main.py         # Main API file
├── frontend/            # Next.js 14 + React frontend
│   └── app/
│       ├── page.tsx    # Main dashboard
│       ├── cameras/    # Camera management UI
│       └── live/       # Live view UI
├── ai-engine/           # YOLO & AI detection code
│   └── detection/
│       └── yolo_detector.py
└── README.md           # This file!
```

---

## 🔧 Backend API Docs

Once the backend is running, go to **http://localhost:8000/docs** for interactive API documentation!

---

## 📚 Custom Training Guide (Suspicious Behavior Detection)

Want to train a custom model to detect fighting, theft, or other suspicious behaviors? Follow this guide!

---

### 1. **Define What Behaviors You Want to Detect**
First, make a clear list of what you want the model to recognize. Common ones for CCTV:
- `person_fighting` (aggressive physical contact)
- `person_running` (abnormal speed)
- `person_loitering` (staying in one spot too long)
- `object_taken` (picking up an object suspiciously)

---

### 2. **Gather/Create Dataset**
You need **labeled video data** (or images with bounding boxes) for training!

#### Options for Getting Data:
1. **Public Datasets** (free, for starting):
   - **UCF-Crime**: Contains real-world CCTV footage of crimes (fighting, theft, etc.)
     - URL: https://www.crcv.ucf.edu/projects/ucf_crime/
   - **ShanghaiTech Campus Dataset**: Crowd and anomaly detection
     - URL: https://svip-lab.github.io/dataset/campus_dataset.html
   - **MIO-TCD**: Traffic and person detection
     - URL: https://tcd.miovision.com/
2. **Record Your Own Footage**:
   - Use your existing CCTV cameras to record sample scenarios (with consent!).
3. **Data Augmentation** (to make your model better):
   - Flip videos horizontally
   - Adjust brightness/contrast
   - Crop/resize frames

#### Labeling the Data:
You need to label **every frame** (or keyframes) of your videos! Tools to use:
- **LabelImg**: For image bounding boxes (https://github.com/heartexlabs/labelImg)
- **CVAT**: For video labeling (https://github.com/opencv/cvat)
- **LabelStudio**: All-in-one (https://labelstud.io/)

Save your labels in **YOLO format** (text files with class id + bounding box coordinates).

---

### 3. **Choose a Model Architecture**
Since we're using **YOLO** already in Sentinel AI, stick with it for consistency! Great options:
- **YOLOv8n / YOLOv8s**: Small/fast, good for real‑time CCTV
- **YOLOv9**: Newer, more accurate (slightly slower)
- **YOLO-NAS**: Optimized for speed and accuracy

---

### 4. **Prepare the Data Structure for YOLO Training**
Organize your data like this (standard YOLO format):

```
cctv_dataset/
├── train/
│   ├── images/       # All your training images/frames
│   └── labels/       # Corresponding .txt label files (YOLO format)
├── val/              # Validation set (same structure as train)
│   ├── images/
│   └── labels/
└── data.yaml         # Configuration file
```

#### Example `data.yaml`:
```yaml
path: c:/path/to/cctv_dataset
train: train/images
val: val/images

nc: 4  # Number of classes
names: ['person_normal', 'person_fighting', 'person_running', 'person_loitering']
```

---

### 5. **Train the Model**
Once your data is ready, train using **Ultralytics YOLO**!

#### Training Steps (Using Python):
1. **Install Ultralytics** (if not already done):
   ```bash
   pip install ultralytics
   ```
2. **Run Training Script**:
   ```python
   from ultralytics import YOLO

   # Load pre-trained YOLO model (small/fast for CCTV)
   model = YOLO('yolov8n.pt')

   # Train the model
   model.train(
       data='c:/path/to/cctv_dataset/data.yaml',
       epochs=50,          # Start with 50-100 epochs
       imgsz=640,          # Image size (matches your input)
       batch=16,           # Adjust based on GPU memory
       device='cuda'       # Use 'cpu' if no GPU
   )

   # After training, save best model
   # Best model will be at runs/detect/train/weights/best.pt
   ```

---

### 6. **Test/Evaluate the Model**
Test the trained model on your validation set or new footage!
```python
# Load trained model
model = YOLO('runs/detect/train/weights/best.pt')

# Test on a video
results = model.predict(
   source='c:/path/to/test_video.mp4',
   show=True,
   save=True
)
```

---

### 7. **Tips for Better Performance**
- **Use a GPU**: Training is 10-100x faster with NVIDIA GPU (CUDA)!
- **More Data = Better Model**: Aim for **1000+ labeled frames per class**!
- **Fine‑Tune, Don’t Train From Scratch**: Always use a pre‑trained model!
- **Augment Aggressively**: Flip, rotate, adjust colors to make model robust!

---

## 📋 To Do (Future Features)

- [ ] AI‑powered theft/ fight/ suspicious behavior detection
- [ ] Video recording & playback
- [ ] Alert system (push notifications, email)
- [ ] Person re‑identification
- [ ] Cloud storage integration
- [ ] User authentication

---

## 💡 Tips

1. **Camera Not Connecting?**
   - Make sure your computer and camera are on the same network
   - Check your camera's RTSP settings (some cameras require enabling RTSP first)
   - Try opening the RTSP URL in VLC media player to verify it works
2. **Performance**: For multiple HD cameras, you may need a more powerful computer

---

Made with ❤️ for security & peace of mind!
