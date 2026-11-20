import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../../context/SettingsContext';

export const AnnouncementBar: React.FC = () => {
  const { announcement } = useSettings();
  const { i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    return sessionStorage.getItem('torena_announcement_dismissed') === '1';
  });

  if (!announcement.enabled || isDismissed || !announcement.text) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('torena_announcement_dismissed', '1');
  };

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div
      style={{
        backgroundColor: announcement.bgColor || '#35483B',
        color: announcement.textColor || '#FAFAF8',
      }}
      className="relative text-xs sm:text-sm py-2 px-4 transition-all duration-200 z-50 border-b border-black/10"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1 text-center font-normal tracking-wide flex items-center justify-center gap-2 flex-wrap">
          <span>{announcement.text}</span>
          {announcement.cta && announcement.link && (
            <Link
              to={announcement.link}
              className="inline-flex items-center gap-1 font-semibold underline underline-offset-4 hover:opacity-80 transition-opacity"
            >
              <span>{announcement.cta}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        <button
          onClick={handleDismiss}
          className="p-1 hover:bg-black/10 rounded transition-colors text-current shrink-0"
          aria-label="Fermer l'annonce"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
