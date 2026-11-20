import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Save, CheckCircle2, Upload, AlertCircle } from 'lucide-react';
import { getAdminSettings, updateAdminSettings, uploadAdminFile } from '../../api/endpoints';
import { useSettings } from '../../context/SettingsContext';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const AdminSettingsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { reloadSettings } = useSettings();
  const isRtl = i18n.language === 'ar';

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Grouped Settings State
  const [formValues, setFormValues] = useState<Record<string, { value_fr: string; value_ar: string }>>({});

  useEffect(() => {
    async function load() {
      try {
        const data = await getAdminSettings();
        const initialMap: Record<string, { value_fr: string; value_ar: string }> = {};
        data.settings.forEach((s) => {
          initialMap[s.key] = {
            value_fr: s.value_fr || '',
            value_ar: s.value_ar || '',
          };
        });
        setFormValues(initialMap);
      } catch (e) {
        console.error('Failed to load admin settings', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleChange = (key: string, lang: 'fr' | 'ar', val: string) => {
    setFormValues((prev) => ({
      ...prev,
      [key]: {
        value_fr: lang === 'fr' ? val : prev[key]?.value_fr || '',
        value_ar: lang === 'ar' ? val : prev[key]?.value_ar || '',
      },
    }));
  };

  const handleFileUpload = async (key: string, file: File, folder: string = 'settings') => {
    try {
      const res = await uploadAdminFile(file, folder);
      setFormValues((prev) => ({
        ...prev,
        [key]: {
          value_fr: res.url,
          value_ar: res.url,
        },
      }));
      setSuccessMessage(`Fichier téléversé pour ${key} !`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erreur lors du téléversement.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await updateAdminSettings(formValues);
      await reloadSettings();
      setSuccessMessage(t('admin.success_saved'));
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erreur lors de la mise à jour des paramètres.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Chargement des paramètres..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-dark-charcoal">
            {t('admin.settings')}
          </h2>
          <p className="text-xs text-muted-gray">
            {isRtl
              ? 'تخصيص كامل لمعلومات المتجر والشريط الإعلاني والواجهة الرئيسية ومعلومات التواصل ثنائية اللغة'
              : 'Contrôle complet des coordonnées, bannières d\'annonces, textes hero, À propos et SEO'}
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-warm-white bg-olive hover:bg-olive-dark rounded-xs transition-colors shadow-xs disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? t('admin.saving') : t('admin.save')}</span>
        </button>
      </div>

      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Promotional Announcement Bar */}
        <div className="bg-white p-6 sm:p-8 rounded-sm border border-gray-200 shadow-xs space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="font-serif font-bold text-base text-dark-charcoal">
              Barre d'annonce promotionnelle supérieure
            </h3>
            <p className="text-xs text-muted-gray">
              Barre fine située tout en haut du site pour afficher les offres spéciales.
            </p>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-dark-charcoal">
              <input
                type="checkbox"
                checked={formValues['announcement_enabled']?.value_fr === '1'}
                onChange={(e) => {
                  const val = e.target.checked ? '1' : '0';
                  handleChange('announcement_enabled', 'fr', val);
                  handleChange('announcement_enabled', 'ar', val);
                }}
                className="rounded border-gray-300 text-olive focus:ring-olive w-4 h-4"
              />
              <span>Activer la barre promotionnelle</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-dark-charcoal mb-1">
                Texte de l'annonce (Français)
              </label>
              <input
                type="text"
                value={formValues['announcement_text']?.value_fr || ''}
                onChange={(e) => handleChange('announcement_text', 'fr', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:border-olive"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-charcoal mb-1">
                نص الإعلان (العربية)
              </label>
              <input
                type="text"
                dir="rtl"
                value={formValues['announcement_text']?.value_ar || ''}
                onChange={(e) => handleChange('announcement_text', 'ar', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:border-olive font-arabic"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-dark-charcoal mb-1">
                Texte du bouton CTA (FR)
              </label>
              <input
                type="text"
                value={formValues['announcement_cta']?.value_fr || ''}
                onChange={(e) => handleChange('announcement_cta', 'fr', e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-charcoal mb-1">
                نص زر الإعلان (AR)
              </label>
              <input
                type="text"
                dir="rtl"
                value={formValues['announcement_cta']?.value_ar || ''}
                onChange={(e) => handleChange('announcement_cta', 'ar', e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded font-arabic"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-charcoal mb-1">
                Lien de redirection
              </label>
              <input
                type="text"
                value={formValues['announcement_link']?.value_fr || ''}
                onChange={(e) => {
                  handleChange('announcement_link', 'fr', e.target.value);
                  handleChange('announcement_link', 'ar', e.target.value);
                }}
                className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded"
              />
            </div>
            <div className="flex gap-4">
              <div>
                <label className="block text-xs font-medium text-dark-charcoal mb-1">
                  Fond
                </label>
                <input
                  type="color"
                  value={formValues['announcement_bg_color']?.value_fr || '#35483B'}
                  onChange={(e) => {
                    handleChange('announcement_bg_color', 'fr', e.target.value);
                    handleChange('announcement_bg_color', 'ar', e.target.value);
                  }}
                  className="w-10 h-8 p-0.5 border border-gray-200 rounded cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-dark-charcoal mb-1">
                  Texte
                </label>
                <input
                  type="color"
                  value={formValues['announcement_text_color']?.value_fr || '#FAFAF8'}
                  onChange={(e) => {
                    handleChange('announcement_text_color', 'fr', e.target.value);
                    handleChange('announcement_text_color', 'ar', e.target.value);
                  }}
                  className="w-10 h-8 p-0.5 border border-gray-200 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Hero Section */}
        <div className="bg-white p-6 sm:p-8 rounded-sm border border-gray-200 shadow-xs space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="font-serif font-bold text-base text-dark-charcoal">
              Section d'accueil Hero
            </h3>
            <p className="text-xs text-muted-gray">
              Titre, sous-titre et visuel principal sur la page d'accueil.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-dark-charcoal mb-1">
                Titre Hero (Français)
              </label>
              <input
                type="text"
                value={formValues['hero_title']?.value_fr || ''}
                onChange={(e) => handleChange('hero_title', 'fr', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:border-olive"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-charcoal mb-1">
                العنوان الرئيسي (العربية)
              </label>
              <input
                type="text"
                dir="rtl"
                value={formValues['hero_title']?.value_ar || ''}
                onChange={(e) => handleChange('hero_title', 'ar', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:border-olive font-arabic"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-dark-charcoal mb-1">
                Sous-titre Hero (Français)
              </label>
              <textarea
                rows={2}
                value={formValues['hero_subtitle']?.value_fr || ''}
                onChange={(e) => handleChange('hero_subtitle', 'fr', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:border-olive"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-charcoal mb-1">
                العنوان الفرعي (العربية)
              </label>
              <textarea
                rows={2}
                dir="rtl"
                value={formValues['hero_subtitle']?.value_ar || ''}
                onChange={(e) => handleChange('hero_subtitle', 'ar', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:border-olive font-arabic"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-dark-charcoal mb-1">
              Image Hero (Téléverser ou saisir URL)
            </label>
            <div className="flex items-center gap-3 mb-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileUpload('hero_image', e.target.files[0], 'hero');
                }}
                className="text-xs file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:bg-gray-100"
              />
            </div>
            <input
              type="url"
              value={formValues['hero_image']?.value_fr || ''}
              onChange={(e) => {
                handleChange('hero_image', 'fr', e.target.value);
                handleChange('hero_image', 'ar', e.target.value);
              }}
              className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded"
              placeholder="https://..."
            />
          </div>
        </div>

        {/* Section 3: Contact & Store Information */}
        <div className="bg-white p-6 sm:p-8 rounded-sm border border-gray-200 shadow-xs space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="font-serif font-bold text-base text-dark-charcoal">
              Coordonnées de la boutique & Réseaux
            </h3>
            <p className="text-xs text-muted-gray">
              Téléphone, WhatsApp, Adresse à Casablanca et horaires d'ouverture.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-dark-charcoal mb-1">
                Téléphone fixe
              </label>
              <input
                type="text"
                value={formValues['phone']?.value_fr || ''}
                onChange={(e) => {
                  handleChange('phone', 'fr', e.target.value);
                  handleChange('phone', 'ar', e.target.value);
                }}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-dark-charcoal mb-1">
                Numéro WhatsApp (sans le +)
              </label>
              <input
                type="text"
                value={formValues['whatsapp_number']?.value_fr || ''}
                onChange={(e) => {
                  handleChange('whatsapp_number', 'fr', e.target.value);
                  handleChange('whatsapp_number', 'ar', e.target.value);
                }}
                placeholder="212661234567"
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-dark-charcoal mb-1">
                Email
              </label>
              <input
                type="email"
                value={formValues['email']?.value_fr || ''}
                onChange={(e) => {
                  handleChange('email', 'fr', e.target.value);
                  handleChange('email', 'ar', e.target.value);
                }}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-dark-charcoal mb-1">
                Adresse (Français)
              </label>
              <textarea
                rows={2}
                value={formValues['address']?.value_fr || ''}
                onChange={(e) => handleChange('address', 'fr', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-charcoal mb-1">
                العنوان (العربية)
              </label>
              <textarea
                rows={2}
                dir="rtl"
                value={formValues['address']?.value_ar || ''}
                onChange={(e) => handleChange('address', 'ar', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded font-arabic"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-dark-charcoal mb-1">
                Horaires (Français)
              </label>
              <input
                type="text"
                value={formValues['opening_hours']?.value_fr || ''}
                onChange={(e) => handleChange('opening_hours', 'fr', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-charcoal mb-1">
                أوقات العمل (العربية)
              </label>
              <input
                type="text"
                dir="rtl"
                value={formValues['opening_hours']?.value_ar || ''}
                onChange={(e) => handleChange('opening_hours', 'ar', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded font-arabic"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-dark-charcoal mb-1">
                Lien Google Maps
              </label>
              <input
                type="url"
                value={formValues['google_maps_url']?.value_fr || ''}
                onChange={(e) => {
                  handleChange('google_maps_url', 'fr', e.target.value);
                  handleChange('google_maps_url', 'ar', e.target.value);
                }}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-charcoal mb-1">
                Lien Instagram
              </label>
              <input
                type="url"
                value={formValues['instagram_url']?.value_fr || ''}
                onChange={(e) => {
                  handleChange('instagram_url', 'fr', e.target.value);
                  handleChange('instagram_url', 'ar', e.target.value);
                }}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-charcoal mb-1">
                Lien Facebook
              </label>
              <input
                type="url"
                value={formValues['facebook_url']?.value_fr || ''}
                onChange={(e) => {
                  handleChange('facebook_url', 'fr', e.target.value);
                  handleChange('facebook_url', 'ar', e.target.value);
                }}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded"
              />
            </div>
          </div>
        </div>

        {/* Section 4: SEO Metadata */}
        <div className="bg-white p-6 sm:p-8 rounded-sm border border-gray-200 shadow-xs space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="font-serif font-bold text-base text-dark-charcoal">
              Référencement SEO & Métadonnées
            </h3>
            <p className="text-xs text-muted-gray">
              Titres et descriptions pour les moteurs de recherche et partages sociaux.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-dark-charcoal mb-1">
                Titre SEO (Français)
              </label>
              <input
                type="text"
                value={formValues['seo_title']?.value_fr || ''}
                onChange={(e) => handleChange('seo_title', 'fr', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-charcoal mb-1">
                عنوان محركات البحث SEO (العربية)
              </label>
              <input
                type="text"
                dir="rtl"
                value={formValues['seo_title']?.value_ar || ''}
                onChange={(e) => handleChange('seo_title', 'ar', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded font-arabic"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-dark-charcoal mb-1">
                Description SEO (Français)
              </label>
              <textarea
                rows={2}
                value={formValues['seo_description']?.value_fr || ''}
                onChange={(e) => handleChange('seo_description', 'fr', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-charcoal mb-1">
                وصف محركات البحث SEO (العربية)
              </label>
              <textarea
                rows={2}
                dir="rtl"
                value={formValues['seo_description']?.value_ar || ''}
                onChange={(e) => handleChange('seo_description', 'ar', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded font-arabic"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-warm-white bg-olive hover:bg-olive-dark rounded-xs transition-colors shadow-xs disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? t('admin.saving') : t('admin.save')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
