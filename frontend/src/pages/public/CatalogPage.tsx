import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Filter, X, SlidersHorizontal } from 'lucide-react';
import { FilterSidebar } from '../../components/catalog/FilterSidebar';
import { SearchBar } from '../../components/catalog/SearchBar';
import { SortDropdown } from '../../components/catalog/SortDropdown';
import { ProductCard } from '../../components/common/ProductCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Pagination } from '../../components/common/Pagination';
import { getBrands, getCategories, getProducts } from '../../api/endpoints';
import { Brand, CatalogFilters, Category, PaginatedResponse, Product } from '../../types';

export const CatalogPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [productsData, setProductsData] = useState<PaginatedResponse<Product> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Initialize filters from URL search params
  const filters: CatalogFilters = {
    category: searchParams.get('category') || undefined,
    brand: searchParams.get('brand') || undefined,
    gender: searchParams.get('gender') || undefined,
    shape: searchParams.get('shape') || undefined,
    color: searchParams.get('color') || undefined,
    price_min: searchParams.get('price_min') ? Number(searchParams.get('price_min')) : undefined,
    price_max: searchParams.get('price_max') ? Number(searchParams.get('price_max')) : undefined,
    is_available: searchParams.get('is_available') === 'true' ? true : undefined,
    promotions: searchParams.get('promotions') === 'true' ? true : undefined,
    search: searchParams.get('search') || undefined,
    sort: (searchParams.get('sort') as CatalogFilters['sort']) || 'featured',
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
  };

  // Load categories and brands once
  useEffect(() => {
    async function loadMeta() {
      try {
        const [cats, brds] = await Promise.all([getCategories(), getBrands()]);
        setCategories(cats);
        setBrands(brds);
      } catch (e) {
        console.error('Failed to load catalog metadata', e);
      }
    }
    loadMeta();
  }, []);

  // Fetch filtered products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProducts(filters);
      setProductsData(data);
    } catch (e) {
      console.error('Failed to fetch products', e);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateFilters = (newFilters: Partial<CatalogFilters>) => {
    const nextParams = new URLSearchParams(searchParams);

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        nextParams.delete(key);
      } else {
        nextParams.set(key, String(value));
      }
    });

    // Reset to page 1 whenever any filter except page is changed
    if (!('page' in newFilters)) {
      nextParams.delete('page');
    }

    setSearchParams(nextParams);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const totalProducts = productsData?.total || 0;

  return (
    <div className="bg-warm-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 border-b border-gray-200/80 pb-6">
          <span className="text-xs uppercase tracking-widest text-olive font-semibold block mb-1">
            Optique Torena
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-dark-charcoal mb-2">
            {t('catalog.title')}
          </h1>
          <p className="text-xs sm:text-sm text-muted-gray max-w-xl">
            {t('catalog.subtitle')}
          </p>
        </div>

        {/* Top Controls Bar: Search, Mobile Filters Trigger, Sort */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
          <SearchBar
            value={filters.search || ''}
            onChange={(search) => updateFilters({ search: search || undefined })}
          />

          <div className="flex items-center gap-3 justify-between sm:justify-end">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold bg-white border border-gray-200 rounded-sm text-dark-charcoal hover:bg-soft-beige transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{t('catalog.filters')}</span>
            </button>

            {/* Sort Dropdown */}
            <SortDropdown
              value={filters.sort}
              onChange={(sort) => updateFilters({ sort })}
            />
          </div>
        </div>

        {/* Layout: Sidebar & Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 bg-white p-6 rounded-sm border border-gray-200/80 shadow-xs sticky top-28">
            <FilterSidebar
              filters={filters}
              categories={categories}
              brands={brands}
              onFilterChange={updateFilters}
              onClearFilters={clearAllFilters}
            />
          </aside>

          {/* Products Grid Area */}
          <main className="lg:col-span-3">
            {/* Results count header */}
            <div className="flex items-center justify-between mb-4 text-xs text-muted-gray">
              <span>
                {t('catalog.results_count', {
                  count: totalProducts,
                  defaultValue: `${totalProducts} modèles trouvés`,
                })}
              </span>

              {/* Active filters pill list */}
              {filters.category && (
                <button
                  onClick={() => updateFilters({ category: undefined })}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-soft-beige text-dark-charcoal rounded text-[11px] hover:bg-gray-200 transition-colors"
                >
                  <span>{filters.category}</span>
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {loading ? (
              <LoadingSpinner text="Chargement des modèles..." />
            ) : productsData && productsData.data.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {productsData.data.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                <Pagination
                  currentPage={productsData.current_page}
                  lastPage={productsData.last_page}
                  onPageChange={(page) => updateFilters({ page })}
                />
              </>
            ) : (
              <EmptyState
                title={t('catalog.no_results_title')}
                description={t('catalog.no_results_desc')}
                actionText={t('catalog.reset_button')}
                onAction={clearAllFilters}
              />
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Slide-over / Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ms-auto w-full max-w-xs sm:max-w-sm bg-white h-full overflow-y-auto p-6 shadow-xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200">
              <span className="font-semibold text-dark-charcoal text-sm">
                {t('catalog.filters')}
              </span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-muted-gray hover:text-dark-charcoal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <FilterSidebar
              filters={filters}
              categories={categories}
              brands={brands}
              onFilterChange={(f) => {
                updateFilters(f);
              }}
              onClearFilters={clearAllFilters}
              isMobileDrawer={true}
              onCloseMobile={() => setMobileFilterOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
