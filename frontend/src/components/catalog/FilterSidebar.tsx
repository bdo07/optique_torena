import React from 'react';
import { useTranslation } from 'react-i18next';
import { RotateCcw, Filter, Check } from 'lucide-react';
import { Brand, CatalogFilters, Category } from '../../types';
import { getLocalizedText } from '../../utils/formatters';

interface FilterSidebarProps {
  filters: CatalogFilters;
  categories: Category[];
  brands: Brand[];
  onFilterChange: (newFilters: Partial<CatalogFilters>) => void;
  onClearFilters: () => void;
  isMobileDrawer?: boolean;
  onCloseMobile?: () => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  categories,
  brands,
  onFilterChange,
  onClearFilters,
  isMobileDrawer = false,
  onCloseMobile,
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language || 'fr') as 'fr' | 'ar';

  const genders = [
    { value: 'homme', label: t('catalog.gender_homme') },
    { value: 'femme', label: t('catalog.gender_femme') },
    { value: 'unisexe', label: t('catalog.gender_unisexe') },
    { value: 'enfant', label: t('catalog.gender_enfant') },
  ];

  const shapes = [
    { value: 'rond', label: t('catalog.shape_rond') },
    { value: 'carre', label: t('catalog.shape_carre') },
    { value: 'rectangle', label: t('catalog.shape_rectangle') },
    { value: 'aviateur', label: t('catalog.shape_aviateur') },
    { value: 'cat-eye', label: t('catalog.shape_cat_eye') },
  ];

  const popularColors = [
    { name: 'Noir', hex: '#1E1E1E' },
    { name: 'Écaille', hex: '#633A18' },
    { name: 'Doré', hex: '#C5A059' },
    { name: 'Argenté', hex: '#B8B8B8' },
    { name: 'Bleu', hex: '#1E3A8A' },
    { name: 'Miel', hex: '#D97706' },
  ];

  const activeFiltersCount = [
    filters.category,
    filters.brand,
    filters.gender,
    filters.shape,
    filters.color,
    filters.price_min,
    filters.price_max,
    filters.is_available,
    filters.promotions,
  ].filter(Boolean).length;

  return (
    <div className="space-y-6 text-sm">
      {/* Header with Clear Button */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
        <div className="flex items-center gap-2 font-semibold text-dark-charcoal">
          <Filter className="w-4 h-4 text-olive" />
          <span>{t('catalog.filters')}</span>
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-olive text-warm-white text-[10px] flex items-center justify-center font-bold">
              {activeFiltersCount}
            </span>
          )}
        </div>

        {activeFiltersCount > 0 && (
          <button
            onClick={onClearFilters}
            className="inline-flex items-center gap-1 text-xs text-muted-gray hover:text-dark-charcoal transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{t('catalog.clear_filters')}</span>
          </button>
        )}
      </div>

      {/* Categories */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-dark-charcoal mb-2.5">
          {t('catalog.categories')}
        </h4>
        <div className="space-y-1">
          <button
            onClick={() => onFilterChange({ category: undefined })}
            className={`w-full text-start px-2 py-1.5 rounded text-xs transition-colors ${
              !filters.category
                ? 'bg-soft-beige font-semibold text-dark-charcoal'
                : 'text-muted-gray hover:text-dark-charcoal hover:bg-gray-100'
            }`}
          >
            {t('catalog.all_categories')}
          </button>

          {categories.map((cat) => {
            const catName = getLocalizedText(cat, 'name', currentLang);
            const isSelected = filters.category === cat.slug;

            return (
              <button
                key={cat.id}
                onClick={() => onFilterChange({ category: cat.slug })}
                className={`w-full text-start flex items-center justify-between px-2 py-1.5 rounded text-xs transition-colors ${
                  isSelected
                    ? 'bg-soft-beige font-semibold text-dark-charcoal'
                    : 'text-muted-gray hover:text-dark-charcoal hover:bg-gray-100'
                }`}
              >
                <span>{catName}</span>
                {cat.products_count !== undefined && (
                  <span className="text-[10px] text-muted-gray bg-gray-200/60 px-1.5 py-0.5 rounded">
                    {cat.products_count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Gender */}
      <div className="pt-4 border-t border-gray-100">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-dark-charcoal mb-2.5">
          {t('catalog.gender')}
        </h4>
        <div className="grid grid-cols-2 gap-1.5">
          {genders.map((g) => {
            const isSelected = filters.gender === g.value;
            return (
              <button
                key={g.value}
                onClick={() =>
                  onFilterChange({ gender: isSelected ? undefined : g.value })
                }
                className={`px-2.5 py-1.5 text-xs text-center border rounded transition-colors ${
                  isSelected
                    ? 'border-olive bg-olive text-warm-white font-medium'
                    : 'border-gray-200 text-dark-charcoal hover:bg-soft-beige'
                }`}
              >
                {g.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Frame Shape */}
      <div className="pt-4 border-t border-gray-100">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-dark-charcoal mb-2.5">
          {t('catalog.frame_shape')}
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {shapes.map((s) => {
            const isSelected = filters.shape === s.value;
            return (
              <button
                key={s.value}
                onClick={() =>
                  onFilterChange({ shape: isSelected ? undefined : s.value })
                }
                className={`px-2.5 py-1 text-xs border rounded transition-colors ${
                  isSelected
                    ? 'border-olive bg-olive text-warm-white font-medium'
                    : 'border-gray-200 text-dark-charcoal hover:bg-soft-beige'
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Brands */}
      <div className="pt-4 border-t border-gray-100">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-dark-charcoal mb-2.5">
          {t('catalog.brands')}
        </h4>
        <div className="max-h-40 overflow-y-auto space-y-1 pe-1">
          {brands.map((b) => {
            const isSelected = filters.brand === b.slug;
            return (
              <button
                key={b.id}
                onClick={() =>
                  onFilterChange({ brand: isSelected ? undefined : b.slug })
                }
                className={`w-full text-start flex items-center justify-between px-2 py-1 rounded text-xs transition-colors ${
                  isSelected
                    ? 'bg-soft-beige font-semibold text-dark-charcoal'
                    : 'text-muted-gray hover:text-dark-charcoal hover:bg-gray-100'
                }`}
              >
                <span>{b.name}</span>
                {b.products_count !== undefined && (
                  <span className="text-[10px] text-muted-gray">
                    ({b.products_count})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Colors */}
      <div className="pt-4 border-t border-gray-100">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-dark-charcoal mb-2.5">
          {t('catalog.colors')}
        </h4>
        <div className="flex flex-wrap gap-2">
          {popularColors.map((c) => {
            const isSelected = filters.color?.toLowerCase() === c.name.toLowerCase();
            return (
              <button
                key={c.name}
                onClick={() =>
                  onFilterChange({ color: isSelected ? undefined : c.name })
                }
                title={c.name}
                className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                  isSelected
                    ? 'ring-2 ring-olive ring-offset-2 scale-110'
                    : 'border-gray-300 hover:scale-105'
                }`}
                style={{ backgroundColor: c.hex }}
              >
                {isSelected && (
                  <Check
                    className={`w-3.5 h-3.5 ${
                      c.name === 'Noir' || c.name === 'Bleu'
                        ? 'text-white'
                        : 'text-black'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="pt-4 border-t border-gray-100">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-dark-charcoal mb-2.5">
          {t('catalog.price_range')}
        </h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder={t('catalog.price_min')}
            value={filters.price_min || ''}
            onChange={(e) =>
              onFilterChange({
                price_min: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:border-olive bg-white"
          />
          <span className="text-muted-gray text-xs">-</span>
          <input
            type="number"
            placeholder={t('catalog.price_max')}
            value={filters.price_max || ''}
            onChange={(e) =>
              onFilterChange({
                price_max: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:border-olive bg-white"
          />
        </div>
      </div>

      {/* Availability & Promotions Toggles */}
      <div className="pt-4 border-t border-gray-100 space-y-2">
        <label className="flex items-center gap-2 text-xs text-dark-charcoal cursor-pointer">
          <input
            type="checkbox"
            checked={!!filters.is_available}
            onChange={(e) =>
              onFilterChange({ is_available: e.target.checked ? true : undefined })
            }
            className="rounded border-gray-300 text-olive focus:ring-olive w-3.5 h-3.5"
          />
          <span>{t('catalog.in_stock_only')}</span>
        </label>

        <label className="flex items-center gap-2 text-xs text-dark-charcoal cursor-pointer">
          <input
            type="checkbox"
            checked={!!filters.promotions}
            onChange={(e) =>
              onFilterChange({ promotions: e.target.checked ? true : undefined })
            }
            className="rounded border-gray-300 text-olive focus:ring-olive w-3.5 h-3.5"
          />
          <span>{t('catalog.promotions_only')}</span>
        </label>
      </div>

      {isMobileDrawer && onCloseMobile && (
        <div className="pt-6 border-t border-gray-200">
          <button
            onClick={onCloseMobile}
            className="w-full py-3 bg-olive text-warm-white text-xs font-semibold uppercase tracking-wider rounded transition-colors"
          >
            {t('nav.close')}
          </button>
        </div>
      )}
    </div>
  );
};
