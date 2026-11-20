import { Language } from '../types';

/**
 * Format price in Moroccan Dirhams (MAD / DH / د.م.)
 */
export function formatPrice(price: number | null | undefined, lang: Language = 'fr'): string {
  if (price === null || price === undefined) return '';

  const formattedNumber = new Intl.NumberFormat(lang === 'ar' ? 'ar-MA' : 'fr-MA', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(price);

  return lang === 'ar' ? `${formattedNumber} د.م.` : `${formattedNumber} MAD`;
}

/**
 * Build WhatsApp contact URL with pre-filled message
 */
export function buildWhatsAppLink(
  phoneNumber: string,
  message: string
): string {
  // Strip non-digit characters
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Build WhatsApp message for product inquiry
 */
export function buildProductWhatsAppMessage(
  productName: string,
  reference: string,
  price: number,
  lang: Language = 'fr'
): string {
  const formattedPrice = formatPrice(price, lang);
  if (lang === 'ar') {
    return `مرحباً أوبتيك تورينا، أود الحصول على مزيد من المعلومات أو حجز النظارة:\n• المنتج: ${productName}\n• المرجع: ${reference}\n• السعر: ${formattedPrice}\nشكراً جزيلاً!`;
  }
  return `Bonjour Optique Torena, je souhaite avoir plus d'informations ou réserver cette monture :\n• Modèle : ${productName}\n• Réf : ${reference}\n• Prix : ${formattedPrice}\nMerci !`;
}

/**
 * Resolve localized text with fallback
 */
export function getLocalizedText(
  item: Record<string, any> | null | undefined,
  fieldPrefix: string,
  lang: Language = 'fr'
): string {
  if (!item) return '';
  const primaryKey = `${fieldPrefix}_${lang}`;
  const fallbackKey = `${fieldPrefix}_${lang === 'fr' ? 'ar' : 'fr'}`;
  return item[primaryKey] || item[fallbackKey] || '';
}

/**
 * Resolve image URL: checks if relative storage path and prepends backend origin if in dev proxy
 */
export function resolveImageUrl(url: string | null | undefined): string {
  if (!url) return 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return url;
}
