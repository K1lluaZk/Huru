import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';

const FEATURES = [
  { title: 'Catálogo curado', detail: 'Electrónica, ropa, hogar y deportes con stock real.' },
  { title: 'Seguimiento de pedidos', detail: 'Del pago al envío, siempre sabes en qué va.' },
  { title: 'Checkout en segundos', detail: 'Un carrito guardado, una dirección, listo.' },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto grid max-w-4xl overflow-hidden rounded-3xl border border-primary-900/10 bg-white shadow-lg shadow-primary-900/5 md:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary-900 p-8 text-primary-50 md:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: 'radial-gradient(circle, #FAFAF7 1px, transparent 1px)',
            backgroundSize: '16px 16px',
          }}
          aria-hidden="true"
        />
        <div className="relative">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-400 font-display text-base font-semibold text-primary-900">
            H
          </span>
          <h2 className="mt-6 font-display text-3xl font-semibold leading-tight">
            Tu tienda, siempre a mano
          </h2>
          <p className="mt-2 text-sm text-primary-200">
            Inicia sesión y sigue justo donde lo dejaste.
          </p>

          <ul className="mt-8 flex flex-col gap-4">
            {FEATURES.map((f) => (
              <li key={f.title} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-accent-400 text-primary-900">
                  <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" aria-hidden="true">
                    <path d="M2 6.2L4.7 9 10 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{f.title}</p>
                  <p className="text-sm text-primary-200">{f.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative price-tag flex items-center gap-4 border-t border-white/10 pt-5 text-xs text-primary-200">
          <span>500+ productos</span>
          <span className="h-1 w-1 rounded-full bg-primary-400" />
          <span>4 categorías</span>
          <span className="h-1 w-1 rounded-full bg-primary-400" />
          <span>Stock en vivo</span>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-col justify-center gap-6 p-8">
        <div>
          <span className="price-tag text-xs font-semibold uppercase tracking-wide text-accent-600">Iniciar sesión</span>
          <h1 className="mt-1 font-display text-3xl font-semibold text-ink">Bienvenido de nuevo</h1>
          <p className="mt-1 text-sm text-gray-500">Ingresa a tu cuenta de Huru</p>
        </div>

        {error && <Alert message={error} />}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-primary-900/10 px-3 py-2.5 text-sm transition focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
              placeholder="tucorreo@ejemplo.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-primary-900/10 px-3 py-2.5 text-sm transition focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full rounded-xl bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-800 disabled:opacity-60"
          >
            {submitting ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="font-medium text-primary-700 hover:underline">
            Regístrate
          </Link>
        </p>

        <div className="rounded-xl bg-accent-50 p-3 text-center text-xs text-accent-700">
          Demo — Admin: admin@huru.com / Admin123! · Cliente: cliente@huru.com / Client123!
        </div>
      </div>
    </div>
  );
}
