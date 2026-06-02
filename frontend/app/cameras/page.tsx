'use client';

import { useEffect, useState } from 'react';

interface Camera {
  id: number;
  name: string;
  rtsp_url: string;
  location: string | null;
  is_active: boolean;
  created_at: string;
}

export default function CamerasPage() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [name, setName] = useState('');
  const [rtspUrl, setRtspUrl] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCameras();
  }, []);

  const loadCameras = async () => {
    const res = await fetch('http://localhost:8000/api/cameras');
    const data = await res.json();
    setCameras(data);
  };

  const addCamera = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch('http://localhost:8000/api/cameras', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, rtsp_url: rtspUrl, location })
    });
    setName('');
    setRtspUrl('');
    setLocation('');
    setLoading(false);
    loadCameras();
  };

  const deleteCamera = async (id: number) => {
    if (!confirm('Are you sure you want to delete this camera?')) return;
    await fetch(`http://localhost:8000/api/cameras/${id}`, { method: 'DELETE' });
    loadCameras();
  };

  const toggleCamera = async (id: number, activate: boolean) => {
    await fetch(`http://localhost:8000/api/cameras/${id}/${activate ? 'start' : 'stop'}`, { method: 'POST' });
    loadCameras();
  };

  return (
    <div style={{ padding: '30px', backgroundColor: '#0f1117', minHeight: '100vh', color: 'white' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', margin: 0 }}>Manage Cameras</h1>
          <a href="/" style={{ color: '#3b82f6', textDecoration: 'none' }}>← Back to Dashboard</a>
        </div>
        
        {/* Add Camera Form */}
        <div style={{ backgroundColor: '#1a1d29', padding: '25px', borderRadius: '12px', border: '1px solid #2d3142', marginBottom: '30px' }}>
          <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Add New Camera</h2>
          <form onSubmit={addCamera} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#9ca3af' }}>Camera Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', padding: '10px', backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '6px', color: 'white' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#9ca3af' }}>Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{ width: '100%', padding: '10px', backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '6px', color: 'white' }}
              />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#9ca3af' }}>RTSP URL (or use "demo0" or "demo1" for samples)</label>
              <input
                type="text"
                required
                value={rtspUrl}
                onChange={(e) => setRtspUrl(e.target.value)}
                placeholder="rtsp://username:password@192.168.1.100:554/stream1"
                style={{ width: '100%', padding: '10px', backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '6px', color: 'white' }}
              />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <button
                type="submit"
                disabled={loading}
                style={{ padding: '12px 30px', backgroundColor: '#3b82f6', border: 'none', borderRadius: '6px', color: 'white', fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer' }}
              >
                {loading ? 'Adding...' : 'Add Camera'}
              </button>
            </div>
          </form>
        </div>
        
        {/* Cameras List */}
        <div style={{ backgroundColor: '#1a1d29', padding: '25px', borderRadius: '12px', border: '1px solid #2d3142' }}>
          <h2 style={{ marginTop: 0, marginBottom: '20px' }}>Cameras</h2>
          {cameras.length === 0 ? (
            <p style={{ color: '#9ca3af' }}>No cameras yet</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {cameras.map(cam => (
                <div key={cam.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', border: '1px solid #2d3142', borderRadius: '8px', backgroundColor: '#141720' }}>
                  <div>
                    <h3 style={{ margin: '0 0 5px 0' }}>{cam.name}</h3>
                    {cam.location && <p style={{ color: '#9ca3af', margin: 0, fontSize: '0.9rem' }}>{cam.location}</p>}
                    <p style={{ color: '#6b7280', margin: '5px 0 0 0', fontSize: '0.85rem' }}>{cam.rtsp_url}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <span style={{ 
                      padding: '6px 15px', borderRadius: '20px', fontSize: '0.85rem',
                      backgroundColor: cam.is_active ? '#22c55e' : '#6b7280'
                    }}>
                      {cam.is_active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                    <button
                      onClick={() => toggleCamera(cam.id, !cam.is_active)}
                      style={{ padding: '8px 16px', backgroundColor: '#374151', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer' }}
                    >
                      {cam.is_active ? 'Stop' : 'Start'}
                    </button>
                    <a
                      href={`/live?camera=${cam.id}`}
                      style={{ padding: '8px 16px', backgroundColor: '#3b82f6', border: 'none', borderRadius: '6px', color: 'white', textDecoration: 'none' }}
                    >
                      View
                    </a>
                    <button
                      onClick={() => deleteCamera(cam.id)}
                      style={{ padding: '8px 16px', backgroundColor: '#dc2626', border: 'none', borderRadius: '6px', color: 'white', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
