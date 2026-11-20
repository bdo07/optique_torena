import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, X, CheckCircle2 } from 'lucide-react';
import {
  createAdminBrand,
  deleteAdminBrand,
  getAdminBrands,
  updateAdminBrand,
} from '../../api/endpoints';
import { Brand } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { resolveImageUrl } from '../../utils/formatters';

export const AdminBrandsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description_fr: '',
    description_ar: '',
    logo_url: '',
    is_active: true,
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const loadBrands = async () => {
    setLoading(true);
    try {
      const data = await getAdminBrands();
      setBrands(data);
    } catch (e) {
      console.error('Failed to load brands', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  const openCreateModal = () => {
    setEditingBrand(null);
    setFormData({
      name: '',
      description_fr: '',
      description_ar: '',
      logo_url: '',
      is_active: true,
    });
    setUploadedFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (b: Brand) => {
    setEditingBrand(b);
    setFormData({
      name: b.name || '',
      description_fr: b.description_fr || '',
      description_ar: b.description_ar || '',
      logo_url: b.logo_url || '',
      is_active: b.is_active,
    });
    setUploadedFile(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('description_fr', formData.description_fr);
      payload.append('description_ar', formData.description_ar);
      payload.append('is_active', formData.is_active ? '1' : '0');

      if (uploadedFile) {
        payload.append('logo', uploadedFile);
      } else if (formData.logo_url) {
        payload.append('logo_url', formData.logo_url);
      }

      if (editingBrand) {
        await updateAdminBrand(editingBrand.id, payload);
      } else {
        await createAdminBrand(payload);
      }

      setIsModalOpen(false);
      setStatusMessage(t('admin.success_saved'));
      loadBrands();
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la sauvegarde de la marque.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(t('admin.delete_confirm'))) return;
    try {
      await deleteAdminBrand(id);
      loadBrands();
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la suppression.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-dark-charcoal">
            {t('admin.brands')}
          </h2>
          <p className="text-xs text-muted-gray">
            {isRtl
              ? 'إدارة دور النظارات والعلامات التجارية الشريكة'
              : 'Gestion des manufactures et marques de créateurs'}
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-warm-white bg-olive hover:bg-olive-dark rounded-xs transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>{t('admin.add_brand')}</span>
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
          <LoadingSpinner text="Chargement des marques..." />
        ) : brands.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-[#FAF9F6] border-b border-gray-200 text-muted-gray uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4 text-start">Marque</th>
                  <th className="py-3 px-4 text-start">Slug</th>
                  <th className="py-3 px-4 text-start">Modèles associés</th>
                  <th className="py-3 px-4 text-start">{t('admin.status')}</th>
                  <th className="py-3 px-4 text-end">{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {brands.map((b) => (
                  <tr key={b.id} className="hover:bg-warm-white/70 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-semibold text-dark-charcoal block">
                        {b.name}
                      </span>
                      {b.description_fr && (
                        <span className="text-[11px] text-muted-gray line-clamp-1">
                          {b.description_fr}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-muted-gray">
                      {b.slug}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-700">
                        {b.products_count || 0}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          b.is_active
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {b.is_active ? t('admin.active') : t('admin.inactive')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-end">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(b)}
                          className="p-1.5 text-olive hover:text-olive-dark hover:bg-olive/10 rounded"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(b.id)}
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
            Aucune marque enregistrée.
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white w-full max-w-lg rounded-sm shadow-xl p-6 sm:p-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
              <h3 className="font-serif font-bold text-base text-dark-charcoal">
                {editingBrand ? 'Modifier la marque' : t('admin.add_brand')}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-muted-gray hover:text-dark-charcoal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-dark-charcoal mb-1">
                  Nom de la marque *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="ex: Ray-Ban, Persol, Oliver Peoples"
                  className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-olive"
                />
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

              <div>
                <label className="block font-medium text-dark-charcoal mb-1">
                  Logo (Fichier ou URL)
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
                  value={formData.logo_url}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
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
                  <span>{t('admin.active')}</span>
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
