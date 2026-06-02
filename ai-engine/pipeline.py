import cv2
import numpy as np
from detection.yolo_detector import YOLODetector
from tracking.byte_tracker import ByteTrack


class SentinelAIPipeline:
    def __init__(self, yolo_model_path: str = "models/yolov8n.pt"):
        self.detector = YOLODetector(model_path=yolo_model_path)
        self.tracker = ByteTrack()
        
    def process_frame(self, frame: np.ndarray):
        detections = self.detector.detect(frame)
        tracks = self.tracker.update(detections)
        
        return {
            "detections": detections,
            "tracks": tracks,
            "frame_with_detections": self.detector.draw_detections(frame, detections),
            "frame_with_tracks": self.tracker.draw_tracks(frame, tracks)
        }
        
    def process_video_stream(self, video_source: str = 0, show: bool = True):
        cap = cv2.VideoCapture(video_source)
        
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
                
            result = self.process_frame(frame)
            
            if show:
                cv2.imshow("Sentinel AI - Detection & Tracking", result["frame_with_tracks"])
                
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break
                    
        cap.release()
        cv2.destroyAllWindows()


if __name__ == "__main__":
    pipeline = SentinelAIPipeline()
    pipeline.process_video_stream()
