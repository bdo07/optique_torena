import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, Eye, ShieldCheck, HeartHandshake } from 'lucide-react';

export const ValuesSection: React.FC = () => {
  const { t } = useTranslation();

  const values = [
    {
      icon: <Eye className="w-5 h-5 text-olive" />,
      title: t('values.precision_title'),
      desc: t('values.precision_desc'),
    },
    {
      icon: <Sparkles className="w-5 h-5 text-olive" />,
      title: t('values.craftsmanship_title'),
      desc: t('values.craftsmanship_desc'),
    },
    {
      icon: <HeartHandshake className="w-5 h-5 text-olive" />,
      title: t('values.advice_title'),
      desc: t('values.advice_desc'),
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-olive" />,
      title: t('values.guarantee_title'),
      desc: t('values.guarantee_desc'),
    },
  ];

  return (
    <section className="py-12 bg-white border-b border-gray-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 rounded-sm hover:bg-warm-white transition-colors"
            >
              <div className="p-2.5 rounded bg-soft-beige shrink-0">{v.icon}</div>
              <div>
                <h4 className="text-sm font-semibold text-dark-charcoal mb-1">
                  {v.title}
                </h4>
                <p className="text-xs text-muted-gray leading-relaxed">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
