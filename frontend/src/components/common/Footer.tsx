import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin, Clock, MessageCircle, Instagram, Facebook } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { buildWhatsAppLink } from '../../utils/formatters';

export const Footer: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { contactInfo, getSetting } = useSettings();
  const isRtl = i18n.language === 'ar';

  const shopName = getSetting('shop_name', 'Optique Torena');
  const whatsAppMessage = isRtl
    ? 'مرحباً أوبتيك تورينا، أود الاستفسار عن خدماتكم وتشكيلات النظارات المتوفرة.'
    : 'Bonjour Optique Torena, je souhaite avoir des renseignements sur vos services et vos montures.';
  const whatsAppLink = buildWhatsAppLink(contactInfo.whatsappNumber, whatsAppMessage);

  return (
    <footer className="bg-[#1C1F1D] text-gray-300 pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-gray-800/80">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-serif tracking-widest text-2xl font-bold text-warm-white uppercase">
                {shopName}
              </span>
              <p className="text-[10px] tracking-[0.25em] text-gray-400 uppercase">
                Casablanca • Haute Lunetterie
              </p>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed">
              {t('footer.tagline')}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={contactInfo.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded bg-white/5 hover:bg-olive hover:text-white flex items-center justify-center transition-colors text-gray-400"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={contactInfo.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded bg-white/5 hover:bg-olive hover:text-white flex items-center justify-center transition-colors text-gray-400"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={whatsAppLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded bg-white/5 hover:bg-emerald-700 hover:text-white flex items-center justify-center transition-colors text-gray-400"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-warm-white mb-4">
              {t('footer.navigation')}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/" className="hover:text-warm-white transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/catalogue" className="hover:text-warm-white transition-colors">
                  {t('nav.catalog')}
                </Link>
              </li>
              <li>
                <Link to="/a-propos" className="hover:text-warm-white transition-colors">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-warm-white transition-colors">
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Univers / Collections */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-warm-white mb-4">
              {t('footer.categories')}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/catalogue?category=lunettes-de-vue" className="hover:text-warm-white transition-colors">
                  {isRtl ? 'نظارات طبية' : 'Lunettes de vue'}
                </Link>
              </li>
              <li>
                <Link to="/catalogue?category=lunettes-de-soleil" className="hover:text-warm-white transition-colors">
                  {isRtl ? 'نظارات شمسية' : 'Lunettes de soleil'}
                </Link>
              </li>
              <li>
                <Link to="/catalogue?category=protection-ecran" className="hover:text-warm-white transition-colors">
                  {isRtl ? 'حماية الشاشات' : 'Protection écran'}
                </Link>
              </li>
              <li>
                <Link to="/catalogue?category=lunettes-de-sport" className="hover:text-warm-white transition-colors">
                  {isRtl ? 'نظارات رياضية' : 'Lunettes de sport'}
                </Link>
              </li>
              <li>
                <Link to="/catalogue?promotions=true" className="hover:text-warm-white transition-colors text-amber-400">
                  {isRtl ? 'عروض خاصة' : 'Offres spéciales'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Boutique & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-warm-white mb-4">
              {t('footer.contact_info')}
            </h4>
            <div className="flex items-start gap-2.5 text-xs text-gray-400">
              <MapPin className="w-4 h-4 shrink-0 text-olive-light mt-0.5" />
              <span>{contactInfo.address}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-gray-400">
              <Phone className="w-4 h-4 shrink-0 text-olive-light" />
              <a href={`tel:${contactInfo.phone}`} className="hover:text-warm-white transition-colors">
                {contactInfo.phone}
              </a>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-gray-400">
              <Mail className="w-4 h-4 shrink-0 text-olive-light" />
              <a href={`mailto:${contactInfo.email}`} className="hover:text-warm-white transition-colors">
                {contactInfo.email}
              </a>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-gray-400 pt-1">
              <Clock className="w-4 h-4 shrink-0 text-olive-light mt-0.5" />
              <span>{contactInfo.openingHours}</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} {shopName}. {t('footer.rights')}
          </p>
          <div className="flex items-center gap-6">
            <Link to="/a-propos" className="hover:text-gray-400 transition-colors">
              {t('footer.privacy')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
