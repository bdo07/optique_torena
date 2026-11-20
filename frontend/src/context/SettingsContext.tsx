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
    expiresAt?: string;
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
  branding: {
    shopName: string;
    shopTagline: string;
    shopLogo: string;
    shopFavicon: string;
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

  const announcementExpiresAt = getSetting('announcement_expires_at');
  const isAnnouncementExpired = announcementExpiresAt
    ? new Date(announcementExpiresAt + 'T23:59:59') < new Date()
    : false;

  const announcement = {
    enabled:
      (getSetting('announcement_enabled', '1') === '1' ||
        getSetting('announcement_enabled', '1') === 'true') &&
      !isAnnouncementExpired,
    text: getSetting('announcement_text', 'Offre spéciale : -20% sur une sélection de montures'),
    cta: getSetting('announcement_cta', 'Découvrir'),
    link: getSetting('announcement_link', '/catalogue'),
    bgColor: getSetting('announcement_bg_color', '#35483B'),
    textColor: getSetting('announcement_text_color', '#FAFAF8'),
    expiresAt: announcementExpiresAt || undefined,
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

  const branding = {
    shopName: getSetting('shop_name', 'Optique Torena'),
    shopTagline: getSetting('shop_tagline', 'Haute Lunetterie & Optique de Précision'),
    shopLogo: getSetting('shop_logo', ''),
    shopFavicon: getSetting('shop_favicon', ''),
  };

  // Synchronize document SEO title, description and favicon
  useEffect(() => {
    const defaultTitle =
      currentLang === 'ar'
        ? 'أوبتيك تورينا | نظارات طبية، شمسية وبصريات دقيقة بالمغرب'
        : 'Optique Torena | Lunettes de Vue, Solaires & Optique de Précision au Maroc';
    const seoTitle = getSetting('seo_title', defaultTitle);

    const defaultDesc =
      currentLang === 'ar'
        ? 'أوبتيك تورينا : أخصائي البصريات الموثوق بالدار البيضاء. استكشفوا تشكيلاتنا الحصرية من النظارات الطبية والشمسية مع استشارات متخصصة.'
        : 'Optique Torena : Votre opticien de confiance à Casablanca. Découvrez nos collections exclusives de lunettes de vue et solaires avec conseil personnalisé et verres haute précision.';
    const seoDescription = getSetting('seo_description', defaultDesc);

    if (seoTitle) {
      document.title = seoTitle;
    }

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && seoDescription) {
      metaDesc.setAttribute('content', seoDescription);
    }

    if (branding.shopFavicon) {
      const iconLink = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
      if (iconLink) {
        iconLink.href = branding.shopFavicon;
      }
    }
  }, [settings, currentLang, branding.shopFavicon]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        isLoading,
        getSetting,
        announcement,
        contactInfo,
        branding,
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
