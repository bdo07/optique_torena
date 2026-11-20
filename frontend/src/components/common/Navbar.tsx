import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, MessageCircle, Phone } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useSettings } from '../../context/SettingsContext';
import { buildWhatsAppLink } from '../../utils/formatters';

export const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { contactInfo } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isRtl = i18n.language === 'ar';

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/catalogue', label: t('nav.catalog') },
    { to: '/a-propos', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') },
  ];

  const whatsAppMessage = isRtl
    ? 'مرحباً أوبتيك تورينا، أود الاستفسار عن تشكيلة النظارات المتوفرة لديكم.'
    : 'Bonjour Optique Torena, je souhaite avoir des renseignements sur vos collections de lunettes.';

  const whatsAppLink = buildWhatsAppLink(contactInfo.whatsappNumber, whatsAppMessage);

  return (
    <header className="sticky top-0 z-40 bg-warm-white/95 backdrop-blur-md border-b border-gray-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Brand Name */}
          <Link
            to="/"
            className="flex flex-col group text-left rtl:text-right"
          >
            <span className="font-serif tracking-widest text-xl sm:text-2xl font-bold text-dark-charcoal uppercase group-hover:text-olive transition-colors">
              Optique Torena
            </span>
            <span className="text-[10px] tracking-[0.25em] text-muted-gray uppercase -mt-0.5">
              Casablanca • Haute Lunetterie
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm tracking-wide transition-colors py-1 relative ${
                    isActive
                      ? 'text-dark-charcoal font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-olive'
                      : 'text-dark-charcoal/80 hover:text-dark-charcoal font-medium'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Actions: Language Switcher & WhatsApp CTA */}
          <div className="hidden md:flex items-center gap-5">
            <LanguageSwitcher />

            <a
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-warm-white bg-olive hover:bg-olive-dark rounded transition-colors shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{t('nav.whatsapp_action')}</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 md:hidden">
            <LanguageSwitcher />
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-dark-charcoal hover:bg-soft-beige rounded transition-colors"
              aria-label={mobileMenuOpen ? t('nav.close') : t('nav.menu')}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-warm-white border-b border-gray-200 px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded text-base transition-colors ${
                    isActive
                      ? 'bg-soft-beige font-semibold text-dark-charcoal'
                      : 'text-dark-charcoal/80 hover:bg-gray-100'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="pt-4 border-t border-gray-200 space-y-3">
            <a
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 text-sm font-semibold text-warm-white bg-olive hover:bg-olive-dark rounded transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t('product.contact_whatsapp')}</span>
            </a>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-gray pt-1">
              <Phone className="w-3.5 h-3.5" />
              <span>{contactInfo.phone}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
