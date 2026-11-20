import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Award, HeartHandshake, Eye } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { resolveImageUrl } from '../../utils/formatters';

export const AboutPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { getSetting } = useSettings();
  const isRtl = i18n.language === 'ar';

  const aboutTitle = getSetting('about_title', t('about.title'));
  const p1 = getSetting('about_text_p1', t('about.p1'));
  const p2 = getSetting('about_text_p2', t('about.p2'));
  const aboutImage = resolveImageUrl(
    getSetting(
      'about_image',
      'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=1200&q=80'
    )
  );

  return (
    <div className="bg-warm-white min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-olive font-semibold block mb-2">
            {isRtl ? 'عن أوبتيك تورينا' : 'À propos d\'Optique Torena'}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-dark-charcoal mb-4">
            {aboutTitle}
          </h1>
          <p className="text-sm text-muted-gray leading-relaxed">
            {t('about.subtitle')}
          </p>
        </div>

        {/* Hero Editorial Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20 bg-white p-8 sm:p-12 rounded-sm border border-gray-200/80 shadow-xs">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-2xl font-serif font-bold text-dark-charcoal">
              {isRtl ? 'رؤيتنا للبصريات الراقية' : 'Notre vision de la haute lunetterie'}
            </h2>
            <p className="text-sm text-dark-charcoal/80 leading-relaxed">
              {p1}
            </p>
            <p className="text-sm text-dark-charcoal/80 leading-relaxed">
              {p2}
            </p>
            <p className="text-sm text-muted-gray leading-relaxed">
              {t('about.p3')}
            </p>
          </div>

          <div className="lg:col-span-6 relative aspect-4/3 rounded-sm overflow-hidden bg-soft-beige">
            <img
              src={aboutImage}
              alt={aboutTitle}
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>

        {/* Brand Values Grid */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-serif font-bold text-dark-charcoal">
              {t('about.values_title')}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-sm border border-gray-200/80 shadow-xs text-center">
              <div className="w-12 h-12 rounded-full bg-soft-beige flex items-center justify-center mx-auto mb-4 text-olive">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-dark-charcoal text-base mb-2">
                {isRtl ? 'جودة الخامات' : 'Excellence des matériaux'}
              </h4>
              <p className="text-xs text-muted-gray leading-relaxed">
                {t('about.value_quality')}
              </p>
            </div>

            <div className="bg-white p-8 rounded-sm border border-gray-200/80 shadow-xs text-center">
              <div className="w-12 h-12 rounded-full bg-soft-beige flex items-center justify-center mx-auto mb-4 text-olive">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-dark-charcoal text-base mb-2">
                {isRtl ? 'الراحة والملاءمة' : 'Confort et ergonomie'}
              </h4>
              <p className="text-xs text-muted-gray leading-relaxed">
                {t('about.value_comfort')}
              </p>
            </div>

            <div className="bg-white p-8 rounded-sm border border-gray-200/80 shadow-xs text-center">
              <div className="w-12 h-12 rounded-full bg-soft-beige flex items-center justify-center mx-auto mb-4 text-olive">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-dark-charcoal text-base mb-2">
                {isRtl ? 'ضمان وخدمة ما بعد البيع' : 'Garantie & Réglages'}
              </h4>
              <p className="text-xs text-muted-gray leading-relaxed">
                {t('about.value_warranty')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
