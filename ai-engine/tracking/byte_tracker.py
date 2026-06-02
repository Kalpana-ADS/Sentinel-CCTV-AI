import numpy as np
from collections import deque


class ByteTrack:
    def __init__(self, track_thresh: float = 0.5, high_thresh: float = 0.6, match_thresh: float = 0.8):
        self.track_thresh = track_thresh
        self.high_thresh = high_thresh
        self.match_thresh = match_thresh
        self.tracks = []
        self.next_id = 1
        
    def update(self, detections: list):
        detections_high = [d for d in detections if d["confidence"] >= self.high_thresh]
        detections_low = [d for d in detections if self.track_thresh <= d["confidence"] < self.high_thresh]
        
        matched = set()
        new_tracks = []
        
        for track in self.tracks:
            best_match = None
            best_iou = 0
            
            for i, det in enumerate(detections_high):
                if i in matched:
                    continue
                    
                iou = self._calculate_iou(track["bbox"], det["bbox"])
                if iou > best_iou and iou >= self.match_thresh:
                    best_iou = iou
                    best_match = (i, det)
                    
            if best_match:
                idx, det = best_match
                track["bbox"] = det["bbox"]
                track["confidence"] = det["confidence"]
                track["history"].append(det["bbox"])
                if len(track["history"]) > 30:
                    track["history"].popleft()
                new_tracks.append(track)
                matched.add(idx)
                
        for i, det in enumerate(detections_high):
            if i not in matched:
                new_track = {
                    "id": self.next_id,
                    "bbox": det["bbox"],
                    "confidence": det["confidence"],
                    "history": deque([det["bbox"]])
                }
                new_tracks.append(new_track)
                self.next_id += 1
                
        self.tracks = new_tracks
        return self.tracks
        
    def _calculate_iou(self, bbox1, bbox2):
        x1_1, y1_1, x2_1, y2_1 = bbox1
        x1_2, y1_2, x2_2, y2_2 = bbox2
        
        x1_inter = max(x1_1, x1_2)
        y1_inter = max(y1_1, y1_2)
        x2_inter = min(x2_1, x2_2)
        y2_inter = min(y2_1, y2_2)
        
        if x2_inter <= x1_inter or y2_inter <= y1_inter:
            return 0.0
            
        inter_area = (x2_inter - x1_inter) * (y2_inter - y1_inter)
        area1 = (x2_1 - x1_1) * (y2_1 - y1_1)
        area2 = (x2_2 - x1_2) * (y2_2 - y1_2)
        union_area = area1 + area2 - inter_area
        
        return inter_area / union_area
        
    def draw_tracks(self, frame, tracks):
        frame_copy = frame.copy()
        for track in tracks:
            x1, y1, x2, y2 = track["bbox"]
            track_id = track["id"]
            label = f"ID: {track_id}"
            
            cv2.rectangle(frame_copy, (x1, y1), (x2, y2), (255, 0, 0), 2)
            cv2.putText(frame_copy, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 2)
            
            if len(track["history"]) > 1:
                points = []
                for bbox in track["history"]:
                    cx = (bbox[0] + bbox[2]) // 2
                    cy = (bbox[1] + bbox[3]) // 2
                    points.append((cx, cy))
                    
                for i in range(len(points) - 1):
                    cv2.line(frame_copy, points[i], points[i + 1], (0, 255, 255), 2)
                    
        return frame_copy


import cv2
