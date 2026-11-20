import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Product } from '../../types';
import { ProductCard } from '../common/ProductCard';

export const FeaturedSection: React.FC<{ products: Product[] }> = ({ products }) => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<'featured' | 'new' | 'bestsellers'>('featured');
  const isRtl = i18n.language === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const filteredProducts = products.filter((p) => {
    if (activeTab === 'new') return p.is_new;
    if (activeTab === 'bestsellers') return p.is_best_seller;
    return p.is_featured;
  });

  // Fallback to all products if filtered tab has none
  const displayed = filteredProducts.length > 0 ? filteredProducts : products;

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-gray-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-olive font-semibold block mb-1">
              {t('home.featured_title')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-dark-charcoal">
              {t('home.featured_subtitle')}
            </h2>
          </div>

          {/* Collection Filter Tabs */}
          <div className="flex items-center gap-1 bg-soft-beige p-1 rounded-sm border border-gray-200/60 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-3 py-1.5 text-xs font-medium rounded-xs transition-colors ${
                activeTab === 'featured'
                  ? 'bg-white text-dark-charcoal font-semibold shadow-xs'
                  : 'text-muted-gray hover:text-dark-charcoal'
              }`}
            >
              {t('catalog.sort_featured')}
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`px-3 py-1.5 text-xs font-medium rounded-xs transition-colors ${
                activeTab === 'new'
                  ? 'bg-white text-dark-charcoal font-semibold shadow-xs'
                  : 'text-muted-gray hover:text-dark-charcoal'
              }`}
            >
              {t('home.new_arrivals')}
            </button>
            <button
              onClick={() => setActiveTab('bestsellers')}
              className={`px-3 py-1.5 text-xs font-medium rounded-xs transition-colors ${
                activeTab === 'bestsellers'
                  ? 'bg-white text-dark-charcoal font-semibold shadow-xs'
                  : 'text-muted-gray hover:text-dark-charcoal'
              }`}
            >
              {t('home.best_sellers')}
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayed.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <Link
            to="/catalogue"
            className="inline-flex items-center gap-2 px-8 py-3.5 text-xs font-semibold uppercase tracking-wider text-dark-charcoal bg-warm-white hover:bg-soft-beige border border-gray-300 rounded-xs transition-colors shadow-xs"
          >
            <span>{t('home.all_products')}</span>
            <ArrowIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
