export default function Footer() {
  return (
    <footer className="mt-16 border-t border-primary-900/10 bg-primary-900 text-primary-200">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-400 font-display text-sm font-semibold text-primary-900">
            H
          </span>
          <span className="font-display text-lg font-semibold text-white">Huru</span>
        </div>
        <p className="price-tag text-xs text-primary-300">
          &copy; {new Date().getFullYear()} Huru — Proyecto final de Programación III
        </p>
      </div>
    </footer>
  );
}
