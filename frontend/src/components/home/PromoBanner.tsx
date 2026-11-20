import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ArrowLeft, Tag } from 'lucide-react';
import { Promotion } from '../../types';
import { getLocalizedText, resolveImageUrl } from '../../utils/formatters';

export const PromoBanner: React.FC<{ promotion?: Promotion | null }> = ({ promotion }) => {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language || 'fr') as 'fr' | 'ar';
  const isRtl = i18n.language === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  if (!promotion) return null;

  const title = getLocalizedText(promotion, 'title', currentLang);
  const desc = getLocalizedText(promotion, 'description', currentLang);
  const cta = getLocalizedText(promotion, 'cta_text', currentLang) || t('home.explore');
  const bannerImg = resolveImageUrl(
    promotion.banner_image_url ||
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80'
  );

  return (
    <section className="py-12 bg-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-sm overflow-hidden bg-dark-charcoal text-warm-white grid grid-cols-1 lg:grid-cols-12 items-center min-h-[300px] shadow-card">
          <div className="lg:col-span-7 p-8 sm:p-12 z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 text-[11px] font-semibold uppercase tracking-wider rounded-xs mb-4">
              <Tag className="w-3.5 h-3.5" />
              <span>{t('home.promo_badge')}</span>
              {promotion.discount_percentage && (
                <span>• -{promotion.discount_percentage}%</span>
              )}
            </div>

            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-3">
              {title}
            </h3>

            {desc && (
              <p className="text-sm text-gray-300 max-w-lg mb-6 leading-relaxed">
                {desc}
              </p>
            )}

            <Link
              to={promotion.cta_link || '/catalogue'}
              className="inline-flex items-center gap-2 px-6 py-3 bg-olive hover:bg-olive-light text-warm-white text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors shadow-xs"
            >
              <span>{cta}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="lg:col-span-5 h-64 lg:h-full relative overflow-hidden">
            <img
              src={bannerImg}
              alt={title}
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r rtl:lg:bg-gradient-to-l from-dark-charcoal via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};
