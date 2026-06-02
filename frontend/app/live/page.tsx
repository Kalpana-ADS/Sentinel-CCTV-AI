'use client';

import { useEffect, useState, useRef } from 'react';

interface Camera {
  id: number;
  name: string;
  rtsp_url: string;
  location: string | null;
  is_active: boolean;
  created_at: string;
}

export default function LivePage() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [currentFrame, setCurrentFrame] = useState('');
  const [activeCameraId, setActiveCameraId] = useState<number | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Load cameras
    fetch('http://localhost:8000/api/cameras')
      .then(res => res.json())
      .then(data => {
        setCameras(data);
        // Check URL for camera parameter
        const params = new URLSearchParams(window.location.search);
        const camId = params.get('camera');
        if (camId) {
          setActiveCameraId(parseInt(camId));
        } else if (data.length > 0) {
          setActiveCameraId(data[0].id);
        }
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (!activeCameraId) return;

    const ws = new WebSocket(`ws://localhost:8000/ws/stream/${activeCameraId}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setCurrentFrame(data.frame);
    };

    return () => {
      ws.close();
    };
  }, [activeCameraId]);

  return (
    <div style={{ padding: '30px', backgroundColor: '#0f1117', minHeight: '100vh', color: 'white' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', margin: 0 }}>Live CCTV View</h1>
          <a href="/" style={{ color: '#3b82f6', textDecoration: 'none' }}>← Back to Dashboard</a>
        </div>
        
        <div style={{ display: 'flex', gap: '25px' }}>
          {/* Camera List */}
          <div style={{ width: '280px', flexShrink: 0 }}>
            <div style={{ backgroundColor: '#1a1d29', padding: '20px', borderRadius: '12px', border: '1px solid #2d3142' }}>
              <h3 style={{ marginTop: 0, marginBottom: '15px' }}>Cameras</h3>
              {cameras.length === 0 ? (
                <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>No cameras. Add one first.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {cameras.map(cam => (
                    <button
                      key={cam.id}
                      onClick={() => setActiveCameraId(cam.id)}
                      style={{
                        width: '100%',
                        padding: '12px 15px',
                        textAlign: 'left',
                        backgroundColor: activeCameraId === cam.id ? '#3b82f6' : '#2d3142',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontWeight: '500' }}>{cam.name}</div>
                      {cam.location && <div style={{ fontSize: '0.8rem', color: '#d1d5db' }}>{cam.location}</div>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Video Feed */}
          <div style={{ flex: 1 }}>
            {!activeCameraId ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '500px', backgroundColor: '#111827', borderRadius: '12px', border: '1px solid #2d3142' }}>
                <p style={{ color: '#9ca3af', fontSize: '1.2rem' }}>Select a camera to view</p>
              </div>
            ) : (
              <div style={{ backgroundColor: '#111827', borderRadius: '12px', border: '1px solid #2d3142', overflow: 'hidden' }}>
                <div style={{ padding: '15px 20px', backgroundColor: '#1a1d29', borderBottom: '1px solid #2d3142' }}>
                  <h2 style={{ margin: 0, fontSize: '1.3rem' }}>
                    {cameras.find(c => c.id === activeCameraId)?.name || 'Camera'}
                  </h2>
                </div>
                <div style={{ aspectRatio: '16/9', backgroundColor: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {currentFrame ? (
                    <img
                      src={`data:image/jpeg;base64,${currentFrame}`}
                      alt="Live"
                      style={{ maxWidth: '100%', maxHeight: '100%', display: 'block' }}
                    />
                  ) : (
                    <p style={{ color: '#6b7280' }}>Connecting...</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
