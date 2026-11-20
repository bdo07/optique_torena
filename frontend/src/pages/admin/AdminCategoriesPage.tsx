import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, X, CheckCircle2 } from 'lucide-react';
import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  updateAdminCategory,
} from '../../api/endpoints';
import { Category } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { getLocalizedText, resolveImageUrl } from '../../utils/formatters';

export const AdminCategoriesPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language || 'fr') as 'fr' | 'ar';
  const isRtl = i18n.language === 'ar';

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name_fr: '',
    name_ar: '',
    description_fr: '',
    description_ar: '',
    image_url: '',
    order: 0,
    is_active: true,
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await getAdminCategories();
      setCategories(data);
    } catch (e) {
      console.error('Failed to load categories', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({
      name_fr: '',
      name_ar: '',
      description_fr: '',
      description_ar: '',
      image_url: '',
      order: categories.length + 1,
      is_active: true,
    });
    setUploadedFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      name_fr: cat.name_fr || '',
      name_ar: cat.name_ar || '',
      description_fr: cat.description_fr || '',
      description_ar: cat.description_ar || '',
      image_url: cat.image_url || '',
      order: cat.order || 0,
      is_active: cat.is_active,
    });
    setUploadedFile(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append('name_fr', formData.name_fr);
      payload.append('name_ar', formData.name_ar);
      payload.append('description_fr', formData.description_fr);
      payload.append('description_ar', formData.description_ar);
      payload.append('order', String(formData.order));
      payload.append('is_active', formData.is_active ? '1' : '0');

      if (uploadedFile) {
        payload.append('image', uploadedFile);
      } else if (formData.image_url) {
        payload.append('image_url', formData.image_url);
      }

      if (editingCategory) {
        await updateAdminCategory(editingCategory.id, payload);
      } else {
        await createAdminCategory(payload);
      }

      setIsModalOpen(false);
      setStatusMessage(t('admin.success_saved'));
      loadCategories();
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la sauvegarde de la catégorie.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(t('admin.delete_confirm'))) return;
    try {
      await deleteAdminCategory(id);
      loadCategories();
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la suppression.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-dark-charcoal">
            {t('admin.categories')}
          </h2>
          <p className="text-xs text-muted-gray">
            {isRtl
              ? 'إدارة أقسام وتصنيفات النظارات وترتيب عرضها'
              : 'Gestion des univers et catégories de lunettes'}
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-warm-white bg-olive hover:bg-olive-dark rounded-xs transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>{t('admin.add_category')}</span>
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
          <LoadingSpinner text="Chargement des catégories..." />
        ) : categories.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-[#FAF9F6] border-b border-gray-200 text-muted-gray uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4 text-start">{t('admin.image')}</th>
                  <th className="py-3 px-4 text-start">Nom (Français / العربية)</th>
                  <th className="py-3 px-4 text-start">Slug</th>
                  <th className="py-3 px-4 text-start">Ordre</th>
                  <th className="py-3 px-4 text-start">Modèles</th>
                  <th className="py-3 px-4 text-start">{t('admin.status')}</th>
                  <th className="py-3 px-4 text-end">{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((c) => (
                  <tr key={c.id} className="hover:bg-warm-white/70 transition-colors">
                    <td className="py-3 px-4">
                      <img
                        src={resolveImageUrl(c.image_url)}
                        alt={c.name_fr}
                        className="w-10 h-10 object-cover rounded bg-soft-beige"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-dark-charcoal block">
                        {c.name_fr}
                      </span>
                      <span className="text-muted-gray font-arabic">
                        {c.name_ar}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-muted-gray">
                      {c.slug}
                    </td>
                    <td className="py-3 px-4 font-mono text-dark-charcoal">
                      {c.order}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-700">
                        {c.products_count || 0}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          c.is_active
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {c.is_active ? t('admin.active') : t('admin.inactive')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-end">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(c)}
                          className="p-1.5 text-olive hover:text-olive-dark hover:bg-olive/10 rounded"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
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
            Aucune catégorie créée.
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white w-full max-w-lg rounded-sm shadow-xl p-6 sm:p-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
              <h3 className="font-serif font-bold text-base text-dark-charcoal">
                {editingCategory ? 'Modifier la catégorie' : t('admin.add_category')}
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
                    Nom (Français) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name_fr}
                    onChange={(e) => setFormData({ ...formData, name_fr: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-olive"
                  />
                </div>
                <div>
                  <label className="block font-medium text-dark-charcoal mb-1">
                    الاسم (العربية) *
                  </label>
                  <input
                    type="text"
                    required
                    dir="rtl"
                    value={formData.name_ar}
                    onChange={(e) => setFormData({ ...formData, name_ar: e.target.value })}
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

              <div>
                <label className="block font-medium text-dark-charcoal mb-1">
                  Image (Téléverser un fichier ou saisir une URL)
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
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded bg-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 items-center pt-2">
                <div>
                  <label className="block font-medium text-dark-charcoal mb-1">
                    Ordre d'affichage
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded"
                  />
                </div>
                <div className="pt-5">
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
