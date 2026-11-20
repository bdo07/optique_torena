import React, { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  const { t } = useTranslation();
  const [localValue, setLocalValue] = useState(value);

  // Sync internal state when external prop changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [localValue, value, onChange]);

  return (
    <div className="relative flex-1">
      <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-muted-gray">
        <Search className="w-4 h-4" />
      </div>

      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder || t('catalog.search_placeholder')}
        className="w-full ps-10 pe-9 py-2.5 text-xs sm:text-sm bg-white border border-gray-200/90 rounded-sm focus:outline-none focus:border-olive focus:ring-1 focus:ring-olive/30 transition-all text-dark-charcoal placeholder:text-muted-gray"
      />

      {localValue && (
        <button
          onClick={() => {
            setLocalValue('');
            onChange('');
          }}
          className="absolute inset-y-0 end-0 flex items-center pe-3 text-muted-gray hover:text-dark-charcoal"
          aria-label="Effacer la recherche"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
