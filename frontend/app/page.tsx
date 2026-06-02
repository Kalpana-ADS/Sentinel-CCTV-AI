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

export default function Dashboard() {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [totalPeople, setTotalPeople] = useState(0);
  const hasActiveCameras = cameras.some(cam => cam.is_active);

  useEffect(() => {
    fetch('http://localhost:8000/api/cameras')
      .then(res => res.json())
      .then(data => setCameras(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: '30px', backgroundColor: '#0f1117', minHeight: '100vh', color: 'white' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '20px', fontSize: '2.5rem', fontWeight: '700' }}>
          Sentinel AI - CCTV Dashboard
        </h1>

        {/* Demo Notice */}
        <div style={{ 
          backgroundColor: '#2a1d00', 
          border: '1px solid #ffcc00', 
          padding: '15px', 
          borderRadius: '8px', 
          marginBottom: '25px' 
        }}>
          <p style={{ margin: 0, color: '#ffcc00' }}>
            📢 Note: Add and start a camera to see real-time people counting!
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px', 
          marginBottom: '35px' 
        }}>
          <div style={{ 
            backgroundColor: '#1a1d29', 
            padding: '25px', 
            borderRadius: '12px', 
            border: '1px solid #2d3142' 
          }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#60a5fa' }}>
              {cameras.length}
            </div>
            <div style={{ color: '#9ca3af', marginTop: '8px' }}>Total Cameras</div>
          </div>
          <div style={{ 
            backgroundColor: '#1a1d29', 
            padding: '25px', 
            borderRadius: '12px', 
            border: '1px solid #2d3142' 
          }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#22c55e' }}>
              {cameras.filter(c => c.is_active).length}
            </div>
            <div style={{ color: '#9ca3af', marginTop: '8px' }}>Active Cameras</div>
          </div>
          <div style={{ 
            backgroundColor: '#1a1d29', 
            padding: '25px', 
            borderRadius: '12px', 
            border: '1px solid #2d3142',
            opacity: hasActiveCameras ? 1 : 0.5
          }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#f59e0b' }}>
              {hasActiveCameras ? '--' : '-'}
            </div>
            <div style={{ color: '#9ca3af', marginTop: '8px' }}>Total People Detected</div>
          </div>
          <div style={{ 
            backgroundColor: '#1a1d29', 
            padding: '25px', 
            borderRadius: '12px', 
            border: '1px solid #2d3142',
            opacity: 0.5
          }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#6b7280' }}>
              -
            </div>
            <div style={{ color: '#9ca3af', marginTop: '8px' }}>Active Alerts</div>
          </div>
        </div>

        {/* Navigation Links */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
          <a href="/live" style={{ 
            padding: '12px 24px', 
            backgroundColor: '#3b82f6', 
            color: 'white', 
            borderRadius: '8px', 
            textDecoration: 'none', 
            fontWeight: '500' 
          }}>
            Live View
          </a>
          <a href="/cameras" style={{ 
            padding: '12px 24px', 
            backgroundColor: '#374151', 
            color: 'white', 
            borderRadius: '8px', 
            textDecoration: 'none', 
            fontWeight: '500' 
          }}>
            Manage Cameras
          </a>
        </div>

        {/* Cameras List */}
        <div style={{ 
          backgroundColor: '#1a1d29', 
          padding: '25px', 
          borderRadius: '12px', 
          border: '1px solid #2d3142' 
        }}>
          <h2 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>Connected Cameras</h2>
          {cameras.length === 0 ? (
            <p style={{ color: '#9ca3af' }}>No cameras connected. Go to "Manage Cameras" to add one!</p>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '20px' 
            }}>
              {cameras.map(cam => (
                <div key={cam.id} style={{ 
                  border: '1px solid #2d3142', 
                  borderRadius: '10px', 
                  padding: '20px', 
                  backgroundColor: '#141720' 
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h3 style={{ margin: 0 }}>{cam.name}</h3>
                    <span style={{ 
                      padding: '5px 12px', 
                      borderRadius: '20px', 
                      fontSize: '0.85rem', 
                      backgroundColor: cam.is_active ? '#22c55e' : '#6b7280' 
                    }}>
                      {cam.is_active ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </div>
                  {cam.location && <p style={{ color: '#9ca3af', margin: '5px 0' }}>{cam.location}</p>}
                  <a href={`/live?camera=${cam.id}`} style={{ 
                    color: '#3b82f6', 
                    textDecoration: 'none', 
                    marginTop: '10px', 
                    display: 'inline-block' 
                  }}>
                    View Live →
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
