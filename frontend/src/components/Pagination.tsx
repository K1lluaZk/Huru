interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 py-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="rounded-lg border border-primary-900/10 px-3 py-1.5 text-sm font-medium text-gray-700 disabled:opacity-40"
      >
        Anterior
      </button>
      <span className="text-sm text-gray-600">
        Página {page} de {totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="rounded-lg border border-primary-900/10 px-3 py-1.5 text-sm font-medium text-gray-700 disabled:opacity-40"
      >
        Siguiente
      </button>
    </div>
  );
}
