import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-base flex items-center justify-center">
      <div className="text-center">
        <p className="text-8xl font-bold text-mauve/30 mb-4">404</p>
        <h1 className="text-2xl font-bold text-text mb-2">Página no encontrada</h1>
        <p className="text-subtext0 mb-8">Esta zona del mapa aún no existe</p>
        <Link to="/" className="bg-mauve text-base font-semibold px-6 py-2.5 rounded-lg hover:bg-mauve/90 transition-colors">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
