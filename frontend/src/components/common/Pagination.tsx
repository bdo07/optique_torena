import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  lastPage,
  onPageChange,
}) => {
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  if (lastPage <= 1) return null;

  const pages = [];
  for (let i = 1; i <= lastPage; i++) {
    pages.push(i);
  }

  const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;

  return (
    <nav className="flex items-center justify-center gap-1.5 pt-8" aria-label="Pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 border border-gray-200 rounded text-dark-charcoal hover:bg-soft-beige disabled:opacity-30 disabled:pointer-events-none transition-colors"
        aria-label="Page précédente"
      >
        <PrevIcon className="w-4 h-4" />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-9 h-9 text-xs font-semibold rounded border transition-colors ${
            p === currentPage
              ? 'bg-olive text-warm-white border-olive'
              : 'bg-white text-dark-charcoal border-gray-200 hover:bg-soft-beige'
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === lastPage}
        className="p-2 border border-gray-200 rounded text-dark-charcoal hover:bg-soft-beige disabled:opacity-30 disabled:pointer-events-none transition-colors"
        aria-label="Page suivante"
      >
        <NextIcon className="w-4 h-4" />
      </button>
    </nav>
  );
};
