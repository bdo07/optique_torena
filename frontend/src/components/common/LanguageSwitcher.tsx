import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export const LanguageSwitcher: React.FC<{ variant?: 'minimal' | 'full' }> = ({
  variant = 'minimal',
}) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'fr';

  const switchLanguage = (lang: 'fr' | 'ar') => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="inline-flex items-center gap-1.5 text-xs font-medium text-dark-charcoal">
      <Globe className="w-3.5 h-3.5 text-muted-gray shrink-0" />
      <div className="inline-flex border border-gray-200 rounded p-0.5 bg-white/70">
        <button
          type="button"
          onClick={() => switchLanguage('fr')}
          className={`px-2 py-0.5 rounded transition-all text-xs ${
            currentLang === 'fr'
              ? 'bg-olive text-warm-white font-semibold shadow-xs'
              : 'text-dark-charcoal hover:bg-soft-beige'
          }`}
          title="Français"
        >
          {variant === 'full' ? 'Français' : 'FR'}
        </button>
        <button
          type="button"
          onClick={() => switchLanguage('ar')}
          className={`px-2 py-0.5 rounded transition-all text-xs font-arabic ${
            currentLang === 'ar'
              ? 'bg-olive text-warm-white font-semibold shadow-xs'
              : 'text-dark-charcoal hover:bg-soft-beige'
          }`}
          title="العربية"
        >
          {variant === 'full' ? 'العربية' : 'عربي'}
        </button>
      </div>
    </div>
  );
};
