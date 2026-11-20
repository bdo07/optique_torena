import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { resolveImageUrl } from '../../utils/formatters';

export const HeroSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { getSetting } = useSettings();
  const isRtl = i18n.language === 'ar';

  const title = getSetting('hero_title', t('hero.title'));
  const subtitle = getSetting('hero_subtitle', t('hero.subtitle'));
  const heroImage = resolveImageUrl(
    getSetting(
      'hero_image',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1920&q=80'
    )
  );
  const ctaPrimary = getSetting('hero_cta_primary', t('hero.cta_primary'));
  const ctaSecondary = getSetting('hero_cta_secondary', t('hero.cta_secondary'));

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section className="relative bg-warm-white overflow-hidden border-b border-gray-200/70">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px] lg:min-h-[640px]">
          {/* Text Content Column */}
          <div className="lg:col-span-6 flex flex-col justify-center px-6 sm:px-12 py-16 lg:py-24 z-10">
            <div className="max-w-xl">
              <span className="inline-block text-xs uppercase tracking-[0.25em] text-olive font-semibold mb-4">
                {isRtl ? 'أوبتيك تورينا • الدار البيضاء' : 'Optique Torena • Casablanca'}
              </span>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-dark-charcoal leading-tight tracking-tight mb-6">
                {title}
              </h1>

              <p className="text-sm sm:text-base text-muted-gray leading-relaxed mb-8 max-w-lg">
                {subtitle}
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  to="/catalogue"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-warm-white bg-olive hover:bg-olive-dark rounded-xs transition-colors shadow-xs"
                >
                  <span>{ctaPrimary}</span>
                  <ArrowIcon className="w-4 h-4" />
                </Link>

                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-dark-charcoal bg-transparent hover:bg-soft-beige border border-dark-charcoal/20 rounded-xs transition-colors"
                >
                  {ctaSecondary}
                </Link>
              </div>
            </div>
          </div>

          {/* Visual Column */}
          <div className="lg:col-span-6 relative min-h-[360px] lg:min-h-full">
            <div className="absolute inset-0 bg-soft-beige">
              <img
                src={heroImage}
                alt={title}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-charcoal/30 via-transparent to-transparent lg:hidden" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
