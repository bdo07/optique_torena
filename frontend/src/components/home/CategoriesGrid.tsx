import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Category } from '../../types';
import { getLocalizedText, resolveImageUrl } from '../../utils/formatters';

export const CategoriesGrid: React.FC<{ categories: Category[] }> = ({ categories }) => {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language || 'fr') as 'fr' | 'ar';
  const isRtl = i18n.language === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section className="py-16 sm:py-20 bg-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-olive font-semibold block mb-1">
              {t('home.categories_title')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-dark-charcoal">
              {t('home.categories_subtitle')}
            </h2>
          </div>

          <Link
            to="/catalogue"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-dark-charcoal hover:text-olive transition-colors"
          >
            <span>{t('home.all_products')}</span>
            <ArrowIcon className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const name = getLocalizedText(cat, 'name', currentLang);
            const desc = getLocalizedText(cat, 'description', currentLang);

            return (
              <Link
                key={cat.id}
                to={`/catalogue?category=${cat.slug}`}
                className="group relative h-72 rounded-sm overflow-hidden border border-gray-200/80 bg-soft-beige flex flex-col justify-end p-6 hover:shadow-card transition-all duration-300"
              >
                <img
                  src={resolveImageUrl(cat.image_url)}
                  alt={name}
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-charcoal/85 via-dark-charcoal/40 to-transparent" />

                <div className="relative z-10 text-warm-white">
                  <span className="text-[10px] tracking-widest uppercase text-gray-300 block mb-1">
                    {cat.products_count !== undefined
                      ? `${cat.products_count} ${isRtl ? 'موديل' : 'modèles'}`
                      : ''}
                  </span>
                  <h3 className="text-lg font-serif font-bold tracking-tight mb-1 text-white">
                    {name}
                  </h3>
                  {desc && (
                    <p className="text-xs text-gray-300 line-clamp-2 mb-3 leading-relaxed">
                      {desc}
                    </p>
                  )}
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-warm-white group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                    <span>{t('home.explore')}</span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
