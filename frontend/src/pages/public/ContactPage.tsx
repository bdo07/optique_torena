import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  ExternalLink,
  Send,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { submitContact } from '../../api/endpoints';
import { buildWhatsAppLink } from '../../utils/formatters';

export const ContactPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { contactInfo } = useSettings();
  const isRtl = i18n.language === 'ar';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const whatsAppMessage = isRtl
    ? 'مرحباً أوبتيك تورينا، أود الاستفسار أو حجز موعد لتجربة النظارات.'
    : 'Bonjour Optique Torena, je souhaite avoir un renseignement ou prendre rendez-vous pour un essayage.';
  const whatsAppLink = buildWhatsAppLink(contactInfo.whatsappNumber, whatsAppMessage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    try {
      await submitContact(formData);
      setSuccess(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (err: any) {
      setErrorMessage(err.message || t('contact.error_desc'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-warm-white min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.25em] text-olive font-semibold block mb-2">
            {t('nav.contact')}
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-dark-charcoal mb-3">
            {t('contact.title')}
          </h1>
          <p className="text-sm text-muted-gray leading-relaxed">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
          {/* Contact Information & Quick Actions */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-sm border border-gray-200/80 shadow-xs space-y-6">
              <h3 className="text-lg font-serif font-bold text-dark-charcoal pb-3 border-b border-gray-100">
                {isRtl ? 'بيانات التواصل المباشر' : 'Coordonnées de la boutique'}
              </h3>

              {/* Direct WhatsApp CTA */}
              <a
                href={whatsAppLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-olive hover:bg-olive-dark text-warm-white text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t('contact.whatsapp')}</span>
              </a>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-olive shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-dark-charcoal block mb-0.5">
                      {t('contact.address')}
                    </span>
                    <p className="text-muted-gray leading-relaxed">
                      {contactInfo.address}
                    </p>
                    <a
                      href={contactInfo.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-olive hover:underline font-medium mt-1.5"
                    >
                      <span>{t('contact.directions')}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-gray-100">
                  <Phone className="w-4 h-4 text-olive shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-dark-charcoal block mb-0.5">
                      {t('contact.phone')}
                    </span>
                    <a
                      href={`tel:${contactInfo.phone}`}
                      className="text-muted-gray hover:text-dark-charcoal transition-colors"
                    >
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-gray-100">
                  <Mail className="w-4 h-4 text-olive shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-dark-charcoal block mb-0.5">
                      {t('contact.email')}
                    </span>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="text-muted-gray hover:text-dark-charcoal transition-colors"
                    >
                      {contactInfo.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-gray-100">
                  <Clock className="w-4 h-4 text-olive shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-dark-charcoal block mb-0.5">
                      {t('contact.hours')}
                    </span>
                    <p className="text-muted-gray leading-relaxed">
                      {contactInfo.openingHours}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-sm border border-gray-200/80 shadow-xs">
            <h3 className="text-lg font-serif font-bold text-dark-charcoal mb-2">
              {t('contact.form_title')}
            </h3>
            <p className="text-xs text-muted-gray mb-6 leading-relaxed">
              {t('contact.form_desc')}
            </p>

            {success ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-sm text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-semibold text-emerald-900 text-sm mb-1">
                  {t('contact.success_title')}
                </h4>
                <p className="text-xs text-emerald-700">
                  {t('contact.success_desc')}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-dark-charcoal mb-1">
                      {t('contact.name')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:border-olive bg-warm-white/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-dark-charcoal mb-1">
                      {t('contact.phone_label')}
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:border-olive bg-warm-white/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-dark-charcoal mb-1">
                      {t('contact.email_label')}
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:border-olive bg-warm-white/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-dark-charcoal mb-1">
                      {t('contact.subject')}
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:border-olive bg-warm-white/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-dark-charcoal mb-1">
                    {t('contact.message')} *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:border-olive bg-warm-white/50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-dark-charcoal hover:bg-black text-warm-white text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {submitting ? t('contact.sending') : t('contact.send')}
                  </span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Embedded Interactive Map */}
        <div className="bg-white p-4 sm:p-6 rounded-sm border border-gray-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-olive" />
              <span className="font-semibold text-dark-charcoal text-xs sm:text-sm">
                {isRtl ? 'موقعنا بالدار البيضاء' : 'Emplacement de la boutique à Casablanca'}
              </span>
            </div>
            <a
              href={contactInfo.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-olive hover:underline font-medium inline-flex items-center gap-1"
            >
              <span>{t('contact.directions')}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="w-full h-80 sm:h-96 rounded-xs overflow-hidden border border-gray-200">
            <iframe
              title="Optique Torena Casablanca Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.846549419131!2d-7.632499684797034!3d33.58334468073581!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7d2e1b1234567%3A0x123456789abcdef!2sBoulevard%20d'Anfa%2C%20Casablanca!5e0!3m2!1sfr!2sma!4v1620000000000!5m2!1sfr!2sma"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
