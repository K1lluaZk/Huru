import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react';
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
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

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
              Comprar nunca fue tan directo y seguro
            </h2>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
              Crea tu cuenta y ten todo listo para tu primera compra.
            </p>

            <ol className="mt-8 flex flex-col gap-4">
              {STEPS.map((step, i) => (
                <li key={step.title} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-zinc-800 text-zinc-300 font-mono text-[10px] font-bold">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-zinc-200">{step.title}</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="relative z-10 flex items-center gap-2 border-t border-zinc-800 pt-5 text-xs text-zinc-400">
            <Shield className="h-3.5 w-3.5 text-zinc-400" />
            <span>Datos protegidos bajo altos estándares de seguridad</span>
          </div>
        </div>

        {/* Form Panel */}
        <div className="flex flex-col justify-center gap-5 p-8 sm:p-10">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
              Nuevo usuario
            </span>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-900">
              Crear una cuenta
            </h1>
            <p className="mt-1 text-xs text-zinc-500">Regístrate para comenzar a comprar</p>
          </div>

          {error && <Alert message={error} />}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-xs font-semibold text-zinc-700">
                Nombre completo
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Juan Pérez"
                  className="w-full rounded-xl border border-zinc-200/90 bg-zinc-50/50 pl-9 pr-3.5 py-2 text-sm transition focus:border-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
              </div>
            </div>

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
                  placeholder="tucorreo@ejemplo.com"
                  className="w-full rounded-xl border border-zinc-200/90 bg-zinc-50/50 pl-9 pr-3.5 py-2 text-sm transition focus:border-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    placeholder="Mínimo 6"
                    className="w-full rounded-xl border border-zinc-200/90 bg-zinc-50/50 pl-9 pr-3.5 py-2 text-sm transition focus:border-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="mb-1.5 block text-xs font-semibold text-zinc-700">
                  Confirmar
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={isVisible ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite"
                    className="w-full rounded-xl border border-zinc-200/90 bg-zinc-50/50 pl-9 pr-8 py-2 text-sm transition focus:border-zinc-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                  <button
                    type="button"
                    onClick={toggleVisibility}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-zinc-400 hover:text-zinc-700 focus:outline-none"
                  >
                    {isVisible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-zinc-800 disabled:opacity-60 cursor-pointer"
            >
              {submitting ? 'Creando cuenta...' : 'Registrarse'}
            </button>
          </form>

          <p className="text-center text-xs text-zinc-500">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="font-semibold text-zinc-900 hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
