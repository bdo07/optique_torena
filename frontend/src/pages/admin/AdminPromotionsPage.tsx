import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, X, CheckCircle2, ToggleLeft, ToggleRight, Tag } from 'lucide-react';
import {
  createAdminPromotion,
  deleteAdminPromotion,
  getAdminPromotions,
  toggleAdminPromotion,
  updateAdminPromotion,
} from '../../api/endpoints';
import { Promotion } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { resolveImageUrl } from '../../utils/formatters';

export const AdminPromotionsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title_fr: '',
    title_ar: '',
    description_fr: '',
    description_ar: '',
    discount_percentage: '',
    promotional_price: '',
    cta_text_fr: 'Découvrir',
    cta_text_ar: 'اكتشف العرض',
    cta_link: '/catalogue',
    banner_image_url: '',
    start_date: '',
    end_date: '',
    is_active: true,
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const loadPromotions = async () => {
    setLoading(true);
    try {
      const data = await getAdminPromotions();
      setPromotions(data);
    } catch (e) {
      console.error('Failed to load promotions', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPromotions();
  }, []);

  const openCreateModal = () => {
    setEditingPromotion(null);
    setFormData({
      title_fr: '',
      title_ar: '',
      description_fr: '',
      description_ar: '',
      discount_percentage: '20',
      promotional_price: '',
      cta_text_fr: 'Découvrir',
      cta_text_ar: 'اكتشف العرض',
      cta_link: '/catalogue',
      banner_image_url: '',
      start_date: '',
      end_date: '',
      is_active: true,
    });
    setUploadedFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Promotion) => {
    setEditingPromotion(p);
    setFormData({
      title_fr: p.title_fr || '',
      title_ar: p.title_ar || '',
      description_fr: p.description_fr || '',
      description_ar: p.description_ar || '',
      discount_percentage: p.discount_percentage ? String(p.discount_percentage) : '',
      promotional_price: p.promotional_price ? String(p.promotional_price) : '',
      cta_text_fr: p.cta_text_fr || 'Découvrir',
      cta_text_ar: p.cta_text_ar || 'اكتشف العرض',
      cta_link: p.cta_link || '/catalogue',
      banner_image_url: p.banner_image_url || '',
      start_date: p.start_date || '',
      end_date: p.end_date || '',
      is_active: p.is_active,
    });
    setUploadedFile(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append('title_fr', formData.title_fr);
      payload.append('title_ar', formData.title_ar);
      payload.append('description_fr', formData.description_fr);
      payload.append('description_ar', formData.description_ar);
      if (formData.discount_percentage) payload.append('discount_percentage', formData.discount_percentage);
      if (formData.promotional_price) payload.append('promotional_price', formData.promotional_price);
      payload.append('cta_text_fr', formData.cta_text_fr);
      payload.append('cta_text_ar', formData.cta_text_ar);
      payload.append('cta_link', formData.cta_link);
      if (formData.start_date) payload.append('start_date', formData.start_date);
      if (formData.end_date) payload.append('end_date', formData.end_date);
      payload.append('is_active', formData.is_active ? '1' : '0');

      if (uploadedFile) {
        payload.append('banner_image', uploadedFile);
      } else if (formData.banner_image_url) {
        payload.append('banner_image_url', formData.banner_image_url);
      }

      if (editingPromotion) {
        await updateAdminPromotion(editingPromotion.id, payload);
      } else {
        await createAdminPromotion(payload);
      }

      setIsModalOpen(false);
      setStatusMessage(t('admin.success_saved'));
      loadPromotions();
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la sauvegarde de la promotion.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await toggleAdminPromotion(id);
      loadPromotions();
    } catch (err: any) {
      alert('Erreur lors du changement de statut.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(t('admin.delete_confirm'))) return;
    try {
      await deleteAdminPromotion(id);
      loadPromotions();
    } catch (err: any) {
      alert('Erreur lors de la suppression.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-dark-charcoal">
            {t('admin.promotions')}
          </h2>
          <p className="text-xs text-muted-gray">
            {isRtl
              ? 'إدارة الحملات الترويجية والخصومات الموسمية المعروضة في الموقع'
              : 'Gestion des campagnes promotionnelles, bannières et remises'}
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-warm-white bg-olive hover:bg-olive-dark rounded-xs transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>{t('admin.add_promotion')}</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      <div className="bg-white rounded-sm border border-gray-200 shadow-xs overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Chargement des promotions..." />
        ) : promotions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-[#FAF9F6] border-b border-gray-200 text-muted-gray uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4 text-start">{t('admin.image')}</th>
                  <th className="py-3 px-4 text-start">Titre (Français / العربية)</th>
                  <th className="py-3 px-4 text-start">Remise / Prix</th>
                  <th className="py-3 px-4 text-start">Période</th>
                  <th className="py-3 px-4 text-start">Lien CTA</th>
                  <th className="py-3 px-4 text-start">{t('admin.status')}</th>
                  <th className="py-3 px-4 text-end">{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {promotions.map((p) => (
                  <tr key={p.id} className="hover:bg-warm-white/70 transition-colors">
                    <td className="py-3 px-4">
                      {p.banner_image_url ? (
                        <img
                          src={resolveImageUrl(p.banner_image_url)}
                          alt={p.title_fr}
                          className="w-12 h-10 object-cover rounded bg-soft-beige"
                        />
                      ) : (
                        <div className="w-12 h-10 rounded bg-soft-beige flex items-center justify-center text-muted-gray">
                          <Tag className="w-4 h-4 text-olive" />
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-dark-charcoal block">
                        {p.title_fr}
                      </span>
                      <span className="text-muted-gray font-arabic">
                        {p.title_ar}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-amber-700">
                      {p.discount_percentage ? `-${p.discount_percentage}%` : ''}
                      {p.promotional_price ? (
                        <span className="block text-dark-charcoal text-[11px] font-medium">
                          {p.promotional_price} MAD
                        </span>
                      ) : null}
                      {!p.discount_percentage && !p.promotional_price && '—'}
                    </td>
                    <td className="py-3 px-4 text-muted-gray text-[11px]">
                      {p.start_date || p.end_date ? (
                        <span>
                          {p.start_date || '...'} → {p.end_date || '...'}
                        </span>
                      ) : (
                        'Permanente'
                      )}
                    </td>
                    <td className="py-3 px-4 text-muted-gray font-mono text-[11px]">
                      {p.cta_link || '—'}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggle(p.id)}
                        className="inline-flex items-center gap-1.5 focus:outline-none"
                        title="Basculer statut"
                      >
                        {p.is_active ? (
                          <ToggleRight className="w-6 h-6 text-emerald-600" />
                        ) : (
                          <ToggleLeft className="w-6 h-6 text-gray-400" />
                        )}
                        <span
                          className={`text-[10px] font-semibold ${
                            p.is_active ? 'text-emerald-700' : 'text-gray-500'
                          }`}
                        >
                          {p.is_active ? t('admin.active') : t('admin.inactive')}
                        </span>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-end">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 text-olive hover:text-olive-dark hover:bg-olive/10 rounded"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-10 text-center text-xs text-muted-gray">
            Aucune promotion créée.
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white w-full max-w-lg rounded-sm shadow-xl p-6 sm:p-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
              <h3 className="font-serif font-bold text-base text-dark-charcoal">
                {editingPromotion ? 'Modifier la promotion' : t('admin.add_promotion')}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-muted-gray hover:text-dark-charcoal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-dark-charcoal mb-1">
                    Titre (Français) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title_fr}
                    onChange={(e) => setFormData({ ...formData, title_fr: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-olive"
                  />
                </div>
                <div>
                  <label className="block font-medium text-dark-charcoal mb-1">
                    العنوان (العربية) *
                  </label>
                  <input
                    type="text"
                    required
                    dir="rtl"
                    value={formData.title_ar}
                    onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-olive font-arabic"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-dark-charcoal mb-1">
                    Description (Français)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description_fr}
                    onChange={(e) => setFormData({ ...formData, description_fr: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-olive"
                  />
                </div>
                <div>
                  <label className="block font-medium text-dark-charcoal mb-1">
                    الوصف (العربية)
                  </label>
                  <textarea
                    rows={2}
                    dir="rtl"
                    value={formData.description_ar}
                    onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-olive font-arabic"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-dark-charcoal mb-1">
                    Pourcentage de remise (%)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.discount_percentage}
                    onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
                    placeholder="ex: 20"
                    className="w-full px-3 py-1.5 border border-gray-200 rounded"
                  />
                </div>
                <div>
                  <label className="block font-medium text-dark-charcoal mb-1">
                    Prix promotionnel fixe (MAD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.promotional_price}
                    onChange={(e) => setFormData({ ...formData, promotional_price: e.target.value })}
                    placeholder="ex: 790"
                    className="w-full px-3 py-1.5 border border-gray-200 rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-dark-charcoal mb-1">
                    Date de début
                  </label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded bg-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-dark-charcoal mb-1">
                    Date de fin
                  </label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-dark-charcoal mb-1">
                  Lien CTA
                </label>
                <input
                  type="text"
                  value={formData.cta_link}
                  onChange={(e) => setFormData({ ...formData, cta_link: e.target.value })}
                  placeholder="/catalogue"
                  className="w-full px-3 py-1.5 border border-gray-200 rounded"
                />
              </div>

              <div>
                <label className="block font-medium text-dark-charcoal mb-1">
                  Bannière (Fichier ou URL)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                  className="w-full mb-2 text-xs file:mr-3 file:py-1 file:px-2.5 file:rounded file:border-0 file:bg-gray-100"
                />
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.banner_image_url}
                  onChange={(e) => setFormData({ ...formData, banner_image_url: e.target.value })}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded bg-white text-xs"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded border-gray-300 text-olive focus:ring-olive w-4 h-4"
                  />
                  <span>Activer la promotion sur le site</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded text-dark-charcoal hover:bg-gray-100"
                >
                  {t('admin.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-olive text-warm-white rounded font-semibold hover:bg-olive-dark disabled:opacity-50"
                >
                  {submitting ? t('admin.saving') : t('admin.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
