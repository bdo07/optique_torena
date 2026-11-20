import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Building2,
  Megaphone,
  Sparkles,
  Info,
  MapPin,
  Search,
} from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<string>('branding');

  // Key-value store for settings
  const [formValues, setFormValues] = useState<
    Record<string, { value_fr: string; value_ar: string }>
  >({});

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

  const handleBothChange = (key: string, val: string) => {
    setFormValues((prev) => ({
      ...prev,
      [key]: {
        value_fr: val,
        value_ar: val,
      },
    }));
  };

  const handleFileUpload = async (
    key: string,
    file: File,
    folder: string = 'settings'
  ) => {
    try {
      const res = await uploadAdminFile(file, folder);
      handleBothChange(key, res.url);
      setSuccessMessage(`Fichier téléversé avec succès !`);
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

  const tabs = [
    { id: 'branding', label: 'Boutique & Logo', icon: Building2 },
    { id: 'announcement', label: 'Barre d\'annonce', icon: Megaphone },
    { id: 'hero', label: 'Accueil Hero', icon: Sparkles },
    { id: 'about', label: 'Section À propos', icon: Info },
    { id: 'contact', label: 'Coordonnées & Accès', icon: MapPin },
    { id: 'seo', label: 'Référencement SEO', icon: Search },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-dark-charcoal">
            {t('admin.settings')}
          </h2>
          <p className="text-xs text-muted-gray">
            {isRtl
              ? 'تخصيص شامل لمعلومات المتجر والشعار والشريط الإعلاني والواجهة ومعلومات التواصل'
              : 'Configuration générale du site, branding, annonces, coordonnées et SEO'}
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

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-gray-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium rounded-t-sm transition-colors whitespace-nowrap border-b-2 -mb-[1px] ${
                activeTab === tab.id
                  ? 'border-olive bg-white text-dark-charcoal font-semibold shadow-2xs'
                  : 'border-transparent text-muted-gray hover:text-dark-charcoal hover:bg-gray-100/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* TAB 1: BRANDING & GENERAL */}
        {activeTab === 'branding' && (
          <div className="bg-white p-6 sm:p-8 rounded-sm border border-gray-200 shadow-xs space-y-6">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="font-serif font-bold text-base text-dark-charcoal">
                Identité de la Boutique
              </h3>
              <p className="text-xs text-muted-gray">
                Nom officiel, slogan et éléments graphiques de marque.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-dark-charcoal mb-1">
                  Nom de la boutique (Français)
                </label>
                <input
                  type="text"
                  value={formValues['shop_name']?.value_fr || ''}
                  onChange={(e) => handleChange('shop_name', 'fr', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:border-olive"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-dark-charcoal mb-1">
                  اسم المتجر (العربية)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={formValues['shop_name']?.value_ar || ''}
                  onChange={(e) => handleChange('shop_name', 'ar', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:border-olive font-arabic"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-dark-charcoal mb-1">
                  Slogan / Tagline (Français)
                </label>
                <input
                  type="text"
                  value={formValues['shop_tagline']?.value_fr || ''}
                  onChange={(e) => handleChange('shop_tagline', 'fr', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:border-olive"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-dark-charcoal mb-1">
                  الشعار اللفظي (العربية)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={formValues['shop_tagline']?.value_ar || ''}
                  onChange={(e) => handleChange('shop_tagline', 'ar', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:border-olive font-arabic"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div>
                <label className="block text-xs font-medium text-dark-charcoal mb-1">
                  Logo de la boutique (URL ou Fichier)
                </label>
                <div className="flex items-center gap-3 mb-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFileUpload('shop_logo', e.target.files[0], 'branding');
                    }}
                    className="text-xs file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:bg-gray-100"
                  />
                </div>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formValues['shop_logo']?.value_fr || ''}
                  onChange={(e) => handleBothChange('shop_logo', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-dark-charcoal mb-1">
                  Favicon du site (URL ou Fichier)
                </label>
                <div className="flex items-center gap-3 mb-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFileUpload('shop_favicon', e.target.files[0], 'branding');
                    }}
                    className="text-xs file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:bg-gray-100"
                  />
                </div>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formValues['shop_favicon']?.value_fr || ''}
                  onChange={(e) => handleBothChange('shop_favicon', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ANNOUNCEMENT BAR */}
        {activeTab === 'announcement' && (
          <div className="bg-white p-6 sm:p-8 rounded-sm border border-gray-200 shadow-xs space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="font-serif font-bold text-base text-dark-charcoal">
                Barre d'annonce promotionnelle supérieure
              </h3>
              <p className="text-xs text-muted-gray">
                Bandeau discret situé au tout sommet du site web avec texte promotionnel et CTA.
              </p>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-dark-charcoal">
                <input
                  type="checkbox"
                  checked={formValues['announcement_enabled']?.value_fr === '1'}
                  onChange={(e) => {
                    const val = e.target.checked ? '1' : '0';
                    handleBothChange('announcement_enabled', val);
                  }}
                  className="rounded border-gray-300 text-olive focus:ring-olive w-4 h-4"
                />
                <span>Afficher la barre promotionnelle</span>
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-dark-charcoal mb-1">
                  Texte CTA (FR)
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
                  onChange={(e) => handleBothChange('announcement_link', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center pt-2">
              <div className="flex gap-4">
                <div>
                  <label className="block text-xs font-medium text-dark-charcoal mb-1">
                    Couleur fond
                  </label>
                  <input
                    type="color"
                    value={formValues['announcement_bg_color']?.value_fr || '#35483B'}
                    onChange={(e) => handleBothChange('announcement_bg_color', e.target.value)}
                    className="w-10 h-8 p-0.5 border border-gray-200 rounded cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-dark-charcoal mb-1">
                    Couleur texte
                  </label>
                  <input
                    type="color"
                    value={formValues['announcement_text_color']?.value_fr || '#FAFAF8'}
                    onChange={(e) => handleBothChange('announcement_text_color', e.target.value)}
                    className="w-10 h-8 p-0.5 border border-gray-200 rounded cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-dark-charcoal mb-1">
                  Date d'expiration optionnelle
                </label>
                <input
                  type="date"
                  value={formValues['announcement_expires_at']?.value_fr || ''}
                  onChange={(e) => handleBothChange('announcement_expires_at', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded"
                />
                <span className="text-[10px] text-muted-gray block mt-0.5">
                  La barre sera masquée automatiquement après cette date.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: HERO SECTION */}
        {activeTab === 'hero' && (
          <div className="bg-white p-6 sm:p-8 rounded-sm border border-gray-200 shadow-xs space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="font-serif font-bold text-base text-dark-charcoal">
                Section Hero de la page d'accueil
              </h3>
              <p className="text-xs text-muted-gray">
                Grand visuel et accroches principales en haut de la page d'accueil.
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-dark-charcoal mb-1">
                  Bouton Principal CTA (Français)
                </label>
                <input
                  type="text"
                  value={formValues['hero_cta_primary']?.value_fr || ''}
                  onChange={(e) => handleChange('hero_cta_primary', 'fr', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-dark-charcoal mb-1">
                  نص الزر الرئيسي (العربية)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={formValues['hero_cta_primary']?.value_ar || ''}
                  onChange={(e) => handleChange('hero_cta_primary', 'ar', e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded font-arabic"
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
                onChange={(e) => handleBothChange('hero_image', e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded"
                placeholder="https://..."
              />
            </div>
          </div>
        )}

        {/* TAB 4: ABOUT SECTION */}
        {activeTab === 'about' && (
          <div className="bg-white p-6 sm:p-8 rounded-sm border border-gray-200 shadow-xs space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="font-serif font-bold text-base text-dark-charcoal">
                Contenu de la section À propos
              </h3>
              <p className="text-xs text-muted-gray">
                Histoire, philosophie optique et engagements qualité affichés sur le site.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-dark-charcoal mb-1">
                  Titre À propos (Français)
                </label>
                <input
                  type="text"
                  value={formValues['about_title']?.value_fr || ''}
                  onChange={(e) => handleChange('about_title', 'fr', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:border-olive"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-dark-charcoal mb-1">
                  عنوان من نحن (العربية)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={formValues['about_title']?.value_ar || ''}
                  onChange={(e) => handleChange('about_title', 'ar', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:border-olive font-arabic"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-dark-charcoal mb-1">
                  Paragraphe 1 (Français)
                </label>
                <textarea
                  rows={3}
                  value={formValues['about_text_p1']?.value_fr || ''}
                  onChange={(e) => handleChange('about_text_p1', 'fr', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:border-olive"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-dark-charcoal mb-1">
                  الفقرة الأولى (العربية)
                </label>
                <textarea
                  rows={3}
                  dir="rtl"
                  value={formValues['about_text_p1']?.value_ar || ''}
                  onChange={(e) => handleChange('about_text_p1', 'ar', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:border-olive font-arabic"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-dark-charcoal mb-1">
                  Paragraphe 2 (Français)
                </label>
                <textarea
                  rows={3}
                  value={formValues['about_text_p2']?.value_fr || ''}
                  onChange={(e) => handleChange('about_text_p2', 'fr', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:border-olive"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-dark-charcoal mb-1">
                  الفقرة الثانية (العربية)
                </label>
                <textarea
                  rows={3}
                  dir="rtl"
                  value={formValues['about_text_p2']?.value_ar || ''}
                  onChange={(e) => handleChange('about_text_p2', 'ar', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:border-olive font-arabic"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-dark-charcoal mb-1">
                Image de la boutique (Téléverser ou saisir URL)
              </label>
              <div className="flex items-center gap-3 mb-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleFileUpload('about_image', e.target.files[0], 'about');
                  }}
                  className="text-xs file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:bg-gray-100"
                />
              </div>
              <input
                type="url"
                value={formValues['about_image']?.value_fr || ''}
                onChange={(e) => handleBothChange('about_image', e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded"
                placeholder="https://..."
              />
            </div>
          </div>
        )}

        {/* TAB 5: CONTACT & ACCESS */}
        {activeTab === 'contact' && (
          <div className="bg-white p-6 sm:p-8 rounded-sm border border-gray-200 shadow-xs space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="font-serif font-bold text-base text-dark-charcoal">
                Coordonnées de la boutique & Accès
              </h3>
              <p className="text-xs text-muted-gray">
                Numéro de téléphone, WhatsApp pour les commandes, adresse physique et horaires.
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
                  onChange={(e) => handleBothChange('phone', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-dark-charcoal mb-1">
                  Numéro WhatsApp (sans le +) *
                </label>
                <input
                  type="text"
                  value={formValues['whatsapp_number']?.value_fr || ''}
                  onChange={(e) => handleBothChange('whatsapp_number', e.target.value)}
                  placeholder="212661234567"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-dark-charcoal mb-1">
                  Affichage WhatsApp
                </label>
                <input
                  type="text"
                  value={formValues['whatsapp_display']?.value_fr || ''}
                  onChange={(e) => handleBothChange('whatsapp_display', e.target.value)}
                  placeholder="+212 6 61 23 45 67"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-dark-charcoal mb-1">
                  Email de contact
                </label>
                <input
                  type="email"
                  value={formValues['email']?.value_fr || ''}
                  onChange={(e) => handleBothChange('email', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-dark-charcoal mb-1">
                  Lien Google Maps (Itinéraire)
                </label>
                <input
                  type="url"
                  value={formValues['google_maps_url']?.value_fr || ''}
                  onChange={(e) => handleBothChange('google_maps_url', e.target.value)}
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
                  Horaires d'ouverture (Français)
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-dark-charcoal mb-1">
                  Lien Instagram
                </label>
                <input
                  type="url"
                  value={formValues['instagram_url']?.value_fr || ''}
                  onChange={(e) => handleBothChange('instagram_url', e.target.value)}
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
                  onChange={(e) => handleBothChange('facebook_url', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SEO METADATA */}
        {activeTab === 'seo' && (
          <div className="bg-white p-6 sm:p-8 rounded-sm border border-gray-200 shadow-xs space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="font-serif font-bold text-base text-dark-charcoal">
                Référencement Naturel (SEO)
              </h3>
              <p className="text-xs text-muted-gray">
                Titres et méta descriptions pris en compte par Google et les réseaux sociaux.
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
                  rows={3}
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
                  rows={3}
                  dir="rtl"
                  value={formValues['seo_description']?.value_ar || ''}
                  onChange={(e) => handleChange('seo_description', 'ar', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded font-arabic"
                />
              </div>
            </div>
          </div>
        )}

        {/* Save button bottom */}
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
