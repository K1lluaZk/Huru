import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, CheckCircle2, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';

const FEATURES = [
  { title: 'Catálogo curado', detail: 'Electrónica, ropa, hogar y deportes con stock real.' },
  { title: 'Seguimiento en tiempo real', detail: 'Del pago al envío, siempre sabes en qué va.' },
  { title: 'Checkout ágil', detail: 'Un carrito guardado, una dirección, listo.' },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

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
    <div className="mx-auto max-w-4xl py-6 sm:py-12">
      <div className="grid overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-xs md:grid-cols-2">
        {/* Brand Side Panel */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-zinc-900 p-8 sm:p-10 text-zinc-100 md:flex">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: 'radial-gradient(circle, #FAFAF7 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
            aria-hidden="true"
          />
          <div className="relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white font-display text-sm font-bold text-zinc-950">
                H
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-white">Huru</span>
            </div>

            <h2 className="mt-8 font-display text-2xl font-bold leading-tight text-white">
              Tu tienda favorita, siempre al alcance
            </h2>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
              Inicia sesión con tu cuenta para acceder a tu carrito y compras.
            </p>

            <ul className="mt-8 flex flex-col gap-4">
              {FEATURES.map((f) => (
                <li key={f.title} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-zinc-800 text-zinc-300">
                    <CheckCircle2 className="h-3 w-3" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-zinc-200">{f.title}</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{f.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative z-10 flex items-center gap-2 border-t border-zinc-800 pt-5 text-xs text-zinc-400">
            <Shield className="h-3.5 w-3.5 text-zinc-400" />
            <span>Acceso seguro con cifrado JWT</span>
          </div>
        </div>

        {/* Form Panel */}
        <div className="flex flex-col justify-center gap-5 p-8 sm:p-10">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
              Cuenta
            </span>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-900">
              Iniciar sesión
            </h1>
            <p className="mt-1 text-xs text-zinc-500">Ingresa tus credenciales para continuar</p>
          </div>

          {error && <Alert message={error} />}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-zinc-700">
                Correo electrónico
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nombre@ejemplo.com"
                  className="w-full rounded-xl border border-zinc-200/90 bg-zinc-50/50 pl-9 pr-3.5 py-2.5 text-sm transition focus:border-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-semibold text-zinc-700">
                Contraseña
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type={isVisible ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-zinc-200/90 bg-zinc-50/50 pl-9 pr-10 py-2.5 text-sm transition focus:border-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
                <button
                  type="button"
                  onClick={toggleVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-zinc-700 focus:outline-none"
                >
                  {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-1 inline-flex w-full items-center justify-center rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-zinc-800 disabled:opacity-60 cursor-pointer"
            >
              {submitting ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <p className="text-center text-xs text-zinc-500">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="font-semibold text-zinc-900 hover:underline">
              Regístrate aquí
            </Link>
          </p>

          <div className="rounded-xl border border-zinc-200/70 bg-zinc-50 p-3 text-center text-[11px] text-zinc-600">
            <span className="font-bold text-zinc-800">Cuentas demo:</span> Admin: <code className="font-mono bg-zinc-200/60 px-1 py-0.5 rounded text-[10px]">admin@huru.com</code> · Cliente: <code className="font-mono bg-zinc-200/60 px-1 py-0.5 rounded text-[10px]">cliente@huru.com</code>
          </div>
        </div>
      </div>
    </div>
  );
}
