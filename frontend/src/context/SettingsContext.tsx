import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getSettings } from '../api/endpoints';
import { Language, WebsiteSettings } from '../types';

interface SettingsContextType {
  settings: WebsiteSettings;
  isLoading: boolean;
  getSetting: (key: string, defaultValue?: string) => string;
  announcement: {
    enabled: boolean;
    text: string;
    cta: string;
    link: string;
    bgColor: string;
    textColor: string;
  };
  contactInfo: {
    phone: string;
    whatsappNumber: string;
    whatsappDisplay: string;
    email: string;
    address: string;
    openingHours: string;
    googleMapsUrl: string;
    instagramUrl: string;
    facebookUrl: string;
  };
  reloadSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<WebsiteSettings>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { i18n } = useTranslation();
  const currentLang = (i18n.language || 'fr') as Language;

  const fetchSettings = async () => {
    try {
      const data = await getSettings();
      setSettings(data);
    } catch (e) {
      console.error('Failed to load website settings', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const getSetting = (key: string, defaultValue: string = ''): string => {
    const item = settings[key];
    if (!item) return defaultValue;
    if (currentLang === 'ar') {
      return item.value_ar || item.value_fr || defaultValue;
    }
    return item.value_fr || item.value_ar || defaultValue;
  };

  const announcement = {
    enabled: getSetting('announcement_enabled', '1') === '1',
    text: getSetting('announcement_text', 'Offre spéciale : -20% sur une sélection de montures'),
    cta: getSetting('announcement_cta', 'Découvrir'),
    link: getSetting('announcement_link', '/catalogue'),
    bgColor: getSetting('announcement_bg_color', '#35483B'),
    textColor: getSetting('announcement_text_color', '#FAFAF8'),
  };

  const contactInfo = {
    phone: getSetting('phone', '+212 5 22 20 30 40'),
    whatsappNumber: getSetting('whatsapp_number', '212661234567'),
    whatsappDisplay: getSetting('whatsapp_display', '+212 6 61 23 45 67'),
    email: getSetting('email', 'contact@optiquetorena.ma'),
    address: getSetting('address', "74 Boulevard d'Anfa, Quartier Gauthier, Casablanca, Maroc"),
    openingHours: getSetting('opening_hours', 'Lundi au Samedi : 09:30 - 20:00 | Dimanche : Fermé'),
    googleMapsUrl: getSetting('google_maps_url', 'https://maps.google.com/?q=Casablanca+Gauthier'),
    instagramUrl: getSetting('instagram_url', 'https://instagram.com/optiquetorena'),
    facebookUrl: getSetting('facebook_url', 'https://facebook.com/optiquetorena'),
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isLoading,
        getSetting,
        announcement,
        contactInfo,
        reloadSettings: fetchSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
