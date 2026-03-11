import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '', displayName: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = data.errors?.[0]?.msg || data.message || 'Error al registrarse';
        throw new Error(msg);
      }
      login(data.data.user, data.data.accessToken, data.data.refreshToken);
      toast.success('¡Cuenta creada! ¡Bienvenido a DevbuPlaytime!');
      navigate('/');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  return (
    <div className="bg-mantle border border-surface0 rounded-2xl p-8">
      <h2 className="text-2xl font-bold text-text mb-1">Crear Cuenta</h2>
      <p className="text-subtext0 text-sm mb-6">Únete a la manada de aprendizaje</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { field: 'displayName', label: 'Nombre', type: 'text', placeholder: 'Tu nombre' },
          { field: 'username', label: 'Username', type: 'text', placeholder: 'devbu93' },
          { field: 'email', label: 'Email', type: 'email', placeholder: 'tu@email.com' },
          { field: 'password', label: 'Contraseña (mín. 8 caracteres)', type: 'password', placeholder: '••••••••' }
        ].map(({ field, label, type, placeholder }) => (
          <div key={field}>
            <label className="block text-sm font-medium text-subtext1 mb-1.5">{label}</label>
            <input
              type={type} required
              value={(form as any)[field]}
              onChange={set(field)}
              className="w-full bg-surface0 border border-surface1 rounded-lg px-4 py-2.5 text-text placeholder-overlay0 focus:outline-none focus:border-mauve transition-colors"
              placeholder={placeholder}
            />
          </div>
        ))}
        <button
          type="submit" disabled={loading}
          className="w-full bg-mauve text-base font-semibold py-2.5 rounded-lg hover:bg-mauve/90 disabled:opacity-50 transition-colors mt-2"
        >
          {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
        </button>
      </form>
      <p className="text-center text-subtext0 text-sm mt-6">
        ¿Ya tienes cuenta?{' '}
        <Link to="/auth/login" className="text-mauve hover:underline font-medium">Inicia sesión</Link>
      </p>
    </div>
  );
}
