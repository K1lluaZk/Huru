export default function Footer() {
  return (
    <footer className="mt-16 border-t border-zinc-200/80 bg-white text-zinc-600">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900 font-display text-xs font-bold text-white shadow-2xs">
            H
          </div>
          <span className="font-display text-base font-bold tracking-tight text-zinc-900">Huru</span>
        </div>
        <p className="text-xs text-zinc-500 font-medium">
          &copy; {new Date().getFullYear()} Huru — Tienda digital moderna
        </p>
      </div>
    </footer>
  );
}
