import { useState } from 'react';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';

type MatchState = 'idle' | 'searching' | 'waiting' | 'matched';

export default function ArenaPage() {
  const { accessToken } = useAuthStore();
  const [state, setState] = useState<MatchState>('idle');
  const [matchId, setMatchId] = useState<string | null>(null);

  const findMatch = async () => {
    setState('searching');
    try {
      const res = await fetch('/api/arena/match', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMatchId(data.data.matchId);
      setState(data.data.status === 'waiting' ? 'waiting' : 'matched');
      if (data.data.status === 'matched') toast.success('¡Oponente encontrado!');
    } catch (e: any) {
      toast.error(e.message);
      setState('idle');
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text mb-2">Arena PvP ⚔️</h1>
        <p className="text-subtext0">Desafía a otros jugadores en tiempo real</p>
      </div>

      {state === 'idle' && (
        <div className="bg-mantle border border-surface0 rounded-2xl p-12 text-center">
          <div className="text-7xl mb-6 animate-float">⚔️</div>
          <h2 className="text-2xl font-bold text-text mb-3">¿Listo para la batalla?</h2>
          <p className="text-subtext0 mb-8">Compite contra otros jugadores en duelos de preguntas</p>
          <button
            onClick={findMatch}
            className="bg-peach text-base font-bold px-10 py-3.5 rounded-xl hover:bg-peach/90 transition-colors text-lg"
          >
            Buscar Partida
          </button>
        </div>
      )}

      {(state === 'searching' || state === 'waiting') && (
        <div className="bg-mantle border border-surface0 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 border-4 border-mauve border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <h2 className="text-xl font-bold text-text mb-2">
            {state === 'searching' ? 'Buscando partida...' : 'Esperando oponente...'}
          </h2>
          <p className="text-subtext0 mb-6">ID de sala: {matchId}</p>
          <button onClick={() => setState('idle')} className="text-red hover:text-red/80 transition-colors text-sm">
            Cancelar búsqueda
          </button>
        </div>
      )}

      {state === 'matched' && (
        <div className="bg-mantle border border-surface0 rounded-2xl p-12 text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-green mb-3">¡Oponente encontrado!</h2>
          <p className="text-subtext0 mb-6">La partida comenzará en unos segundos...</p>
          <p className="text-xs text-overlay0">Match ID: {matchId}</p>
        </div>
      )}

      <div className="mt-8 grid grid-cols-3 gap-4">
        {[
          { label: 'Modo rápido', desc: '5 preguntas · 30s c/u', icon: '⚡' },
          { label: 'Modo clásico', desc: '10 preguntas · 45s c/u', icon: '📚' },
          { label: 'Modo experto', desc: '15 preguntas · 20s c/u', icon: '🔥' }
        ].map(({ label, desc, icon }) => (
          <div key={label} className="bg-mantle border border-surface0 rounded-xl p-4 text-center opacity-50">
            <p className="text-2xl mb-2">{icon}</p>
            <p className="font-semibold text-text text-sm">{label}</p>
            <p className="text-xs text-subtext0 mt-1">{desc}</p>
            <p className="text-xs text-overlay0 mt-2">Próximamente</p>
          </div>
        ))}
      </div>
    </div>
  );
}
