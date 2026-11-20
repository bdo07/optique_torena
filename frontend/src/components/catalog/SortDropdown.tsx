import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUpDown } from 'lucide-react';
import { CatalogFilters } from '../../types';

interface SortDropdownProps {
  value: CatalogFilters['sort'];
  onChange: (sort: CatalogFilters['sort']) => void;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({ value, onChange }) => {
  const { t } = useTranslation();

  const options = [
    { value: 'featured', label: t('catalog.sort_featured') },
    { value: 'newest', label: t('catalog.sort_newest') },
    { value: 'price_asc', label: t('catalog.sort_price_asc') },
    { value: 'price_desc', label: t('catalog.sort_price_desc') },
  ];

  return (
    <div className="relative inline-flex items-center">
      <div className="absolute start-3 pointer-events-none text-muted-gray">
        <ArrowUpDown className="w-3.5 h-3.5" />
      </div>
      <select
        value={value || 'featured'}
        onChange={(e) => onChange(e.target.value as CatalogFilters['sort'])}
        className="ps-8 pe-8 py-2.5 text-xs bg-white border border-gray-200/90 rounded-sm focus:outline-none focus:border-olive focus:ring-1 focus:ring-olive/30 text-dark-charcoal cursor-pointer appearance-none transition-all font-medium"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
