import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';

const STEPS = [
  { title: 'Crea tu cuenta', detail: 'Nombre, correo y contraseña. Menos de un minuto.' },
  { title: 'Arma tu carrito', detail: 'Guardado en tu cuenta, disponible en cualquier dispositivo.' },
  { title: 'Confirma tu pedido', detail: 'Dirección de envío y listo — sin pasos de más.' },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setSubmitting(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarse');
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
            Comprar nunca fue tan directo
          </h2>
          <p className="mt-2 text-sm text-primary-200">
            Crea tu cuenta y ten todo listo para tu primera compra.
          </p>

          <ol className="mt-8 flex flex-col gap-5">
            {STEPS.map((step, i) => (
              <li key={step.title} className="flex items-start gap-3">
                <span className="price-tag mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-accent-300">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{step.title}</p>
                  <p className="text-sm text-primary-200">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <p className="relative border-t border-white/10 pt-5 text-xs text-primary-200">
          Al registrarte podrás llevar seguimiento de tus pedidos y guardar tu carrito entre sesiones.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-col justify-center gap-5 p-8">
        <div>
          <span className="price-tag text-xs font-semibold uppercase tracking-wide text-accent-600">Crear cuenta</span>
          <h1 className="mt-1 font-display text-3xl font-semibold text-ink">Únete a Huru</h1>
          <p className="mt-1 text-sm text-gray-500">Regístrate para comenzar a comprar</p>
        </div>

        {error && <Alert message={error} />}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
              Nombre completo
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-primary-900/10 px-3 py-2.5 text-sm transition focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
              placeholder="Juan Pérez"
            />
          </div>
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
          <div className="grid grid-cols-2 gap-3">
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
                placeholder="Mínimo 6"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-gray-700">
                Confirmar
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-primary-900/10 px-3 py-2.5 text-sm transition focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                placeholder="Repite"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full rounded-xl bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-800 disabled:opacity-60"
          >
            {submitting ? 'Creando cuenta...' : 'Registrarse'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-medium text-primary-700 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
