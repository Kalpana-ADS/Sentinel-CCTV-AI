import cv2
import numpy as np
from ultralytics import YOLO


class YOLODetector:
    def __init__(self, model_path: str = "models/yolov8n.pt", conf_threshold: float = 0.5):
        self.model = YOLO(model_path)
        self.conf_threshold = conf_threshold
        self.target_classes = ["person"]
        
    def detect(self, frame: np.ndarray):
        results = self.model(frame, conf=self.conf_threshold, classes=[0], verbose=False)
        detections = []
        
        for result in results:
            for box in result.boxes:
                x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                confidence = box.conf[0].cpu().numpy()
                class_id = int(box.cls[0].cpu().numpy())
                class_name = self.model.names[class_id]
                
                detections.append({
                    "bbox": [int(x1), int(y1), int(x2), int(y2)],
                    "confidence": float(confidence),
                    "class_id": class_id,
                    "class_name": class_name
                })
                
        return detections
    
    def draw_detections(self, frame: np.ndarray, detections: list):
        frame_copy = frame.copy()
        for det in detections:
            x1, y1, x2, y2 = det["bbox"]
            conf = det["confidence"]
            label = f"Person {conf:.2f}"
            
            cv2.rectangle(frame_copy, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(frame_copy, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
            
        return frame_copy
