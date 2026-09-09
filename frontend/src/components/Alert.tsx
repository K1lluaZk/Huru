import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

interface AlertProps {
  type?: 'error' | 'success' | 'info' | 'warning';
  message: string;
}

const alertConfig = {
  error: {
    container: 'bg-red-50/80 text-red-800 border-red-200/70',
    icon: <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-600 mt-0.5" />,
  },
  success: {
    container: 'bg-emerald-50/80 text-emerald-800 border-emerald-200/70',
    icon: <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-600 mt-0.5" />,
  },
  info: {
    container: 'bg-sky-50/80 text-sky-800 border-sky-200/70',
    icon: <Info className="h-4 w-4 flex-shrink-0 text-sky-600 mt-0.5" />,
  },
  warning: {
    container: 'bg-amber-50/80 text-amber-800 border-amber-200/70',
    icon: <AlertTriangle className="h-4 w-4 flex-shrink-0 text-amber-600 mt-0.5" />,
  },
};

export default function Alert({ type = 'error', message }: AlertProps) {
  if (!message) return null;
  const config = alertConfig[type];

  return (
    <div
      role="alert"
      className={`flex items-start gap-2.5 rounded-xl border px-3.5 py-2.5 text-xs sm:text-sm font-medium transition-all ${config.container}`}
    >
      {config.icon}
      <div className="flex-1 leading-snug">{message}</div>
    </div>
  );
}
