import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { io, Socket } from 'socket.io-client';
import toast from 'react-hot-toast';

export function ArenaRoomPage() {
  const { roomCode } = useParams<{ roomCode: string }>();
  const navigate = useNavigate();
  const { user, accessToken } = useAuthStore();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [players, setPlayers] = useState<string[]>([]);
  const [status, setStatus] = useState<'waiting' | 'playing' | 'finished'>('waiting');

  useEffect(() => {
    const s = io(import.meta.env.VITE_API_URL || 'http://localhost:3001', {
      auth: { token: accessToken }
    });
    s.emit('arena:join', { roomCode });
    s.on('arena:players', (p: string[]) => setPlayers(p));
    s.on('arena:start', () => setStatus('playing'));
    s.on('arena:finish', () => { setStatus('finished'); toast.success('¡Arena finalizada!'); });
    s.on('connect_error', () => toast.error('Error de conexión con la arena'));
    setSocket(s);
    return () => { s.disconnect(); };
  }, [roomCode, accessToken]);

  return (
    <div style={{ padding: '24px 32px', maxWidth: 700, margin: '0 auto' }}>
      <h1 style={{ color: '#cba6f7', fontSize: 28, marginBottom: 8 }}>⚔️ Arena</h1>
      <p style={{ color: '#a6adc8', marginBottom: 24 }}>Sala: <code style={{ color: '#f9e2af' }}>{roomCode}</code></p>
      {status === 'waiting' && (
        <div style={{ background: '#1e1e2e', border: '1px solid #313244', borderRadius: 12, padding: 24 }}>
          <p style={{ color: '#a6adc8', marginBottom: 12 }}>Esperando jugadores...</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {players.map(p => (
              <span key={p} style={{ background: '#313244', color: '#cdd6f4', padding: '4px 12px', borderRadius: 20, fontSize: 13 }}>{p}</span>
            ))}
          </div>
        </div>
      )}
      {status === 'finished' && (
        <button onClick={() => navigate('/arena')} style={{ background: '#cba6f7', color: '#1e1e2e', border: 'none', borderRadius: 10, padding: '12px 24px', cursor: 'pointer', fontWeight: 700 }}>
          Volver a la Arena
        </button>
      )}
    </div>
  );
}
