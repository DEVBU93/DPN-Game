import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../stores/authStore';

export default function ProfilePage() {
  const { user, accessToken } = useAuthStore();

  const { data: progressData } = useQuery({
    queryKey: ['progress'],
    queryFn: async () => {
      const res = await fetch('/api/progress', { headers: { Authorization: `Bearer ${accessToken}` } });
      return res.json();
    }
  });

  const { data: achievementsData } = useQuery({
    queryKey: ['achievements-me'],
    queryFn: async () => {
      const res = await fetch('/api/achievements/me', { headers: { Authorization: `Bearer ${accessToken}` } });
      return res.json();
    }
  });

  const progress = progressData?.data;
  const achievements = achievementsData?.data || [];

  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Avatar & info */}
      <div className="bg-mantle border border-surface0 rounded-2xl p-8 mb-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-mauve/20 flex items-center justify-center text-4xl font-bold text-mauve">
            {user?.displayName?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text">{user?.displayName}</h1>
            <p className="text-subtext0">@{user?.username}</p>
            <p className="text-sm text-subtext0 mt-1">{user?.email}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-3xl font-bold text-mauve">Nv. {progress?.level || 1}</p>
            <p className="text-sm text-subtext0">{progress?.totalXp || 0} XP total</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Mundos', value: progress?.worldsCompleted || 0, icon: '🌍' },
          { label: 'Misiones', value: progress?.missionsCompleted || 0, icon: '✅' },
          { label: 'Victorias', value: progress?.arenaWins || 0, icon: '⚔️' },
          { label: 'Monedas', value: progress?.coins || 0, icon: '🪙' }
        ].map(({ label, value, icon }) => (
          <div key={label} className="bg-mantle border border-surface0 rounded-xl p-4 text-center">
            <p className="text-2xl mb-1">{icon}</p>
            <p className="text-xl font-bold text-text">{value}</p>
            <p className="text-xs text-subtext0">{label}</p>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <div className="bg-mantle border border-surface0 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-text mb-4">Logros {achievements.length > 0 && `(${achievements.length})`}</h2>
        {achievements.length === 0 ? (
          <p className="text-subtext0 text-sm">Aún no tienes logros. ¡Completa misiones para desbloquearlos!</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((ach: any) => (
              <div key={ach.id} className="flex items-center gap-3 bg-surface0 rounded-xl p-3">
                <span className="text-2xl">{ach.icon}</span>
                <div>
                  <p className="text-sm font-medium text-text">{ach.name}</p>
                  <p className="text-xs text-subtext0">{ach.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
