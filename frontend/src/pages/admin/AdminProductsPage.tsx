import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  X,
  Upload,
  Star,
  Check,
} from 'lucide-react';
import {
  createAdminProduct,
  deleteAdminProduct,
  deleteAdminProductImage,
  getAdminBrands,
  getAdminCategories,
  getAdminProducts,
  setAdminPrimaryProductImage,
  updateAdminProduct,
  uploadAdminProductImage,
} from '../../api/endpoints';
import { Brand, Category, PaginatedResponse, Product } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Pagination } from '../../components/common/Pagination';
import { formatPrice, getLocalizedText, resolveImageUrl } from '../../utils/formatters';

export const AdminProductsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language || 'fr') as 'fr' | 'ar';
  const isRtl = i18n.language === 'ar';

  const [productsData, setProductsData] = useState<PaginatedResponse<Product> | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters & Search
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  // Modals & Forms
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState<boolean>(false);
  const [galleryProduct, setGalleryProduct] = useState<Product | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name_fr: '',
    name_ar: '',
    reference: '',
    price: '',
    old_price: '',
    category_id: '',
    brand_id: '',
    gender: 'unisexe',
    frame_shape: 'rectangle',
    colors: '',
    description_fr: '',
    description_ar: '',
    is_available: true,
    is_featured: false,
    is_new: false,
    is_best_seller: false,
    image_url_1: '',
    image_url_2: '',
  });

  const [uploadedFiles, setUploadedFiles] = useState<FileList | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cats, brds, prods] = await Promise.all([
        getAdminCategories(),
        getAdminBrands(),
        getAdminProducts({
          page,
          search: search || undefined,
          category_id: selectedCategory ? Number(selectedCategory) : undefined,
          brand_id: selectedBrand ? Number(selectedBrand) : undefined,
        }),
      ]);
      setCategories(cats);
      setBrands(brds);
      setProductsData(prods);
    } catch (e) {
      console.error('Failed to load products', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, selectedCategory, selectedBrand]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadData();
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name_fr: '',
      name_ar: '',
      reference: `TOR-${Math.floor(1000 + Math.random() * 9000)}`,
      price: '',
      old_price: '',
      category_id: categories[0]?.id?.toString() || '',
      brand_id: brands[0]?.id?.toString() || '',
      gender: 'unisexe',
      frame_shape: 'rectangle',
      colors: 'Noir, Écaille',
      description_fr: '',
      description_ar: '',
      is_available: true,
      is_featured: false,
      is_new: true,
      is_best_seller: false,
      image_url_1: '',
      image_url_2: '',
    });
    setUploadedFiles(null);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name_fr: p.name_fr || '',
      name_ar: p.name_ar || '',
      reference: p.reference || '',
      price: p.price?.toString() || '',
      old_price: p.old_price?.toString() || '',
      category_id: p.category_id?.toString() || '',
      brand_id: p.brand_id?.toString() || '',
      gender: p.gender || 'unisexe',
      frame_shape: p.frame_shape || 'rectangle',
      colors: Array.isArray(p.colors) ? p.colors.join(', ') : '',
      description_fr: p.description_fr || '',
      description_ar: p.description_ar || '',
      is_available: p.is_available,
      is_featured: p.is_featured,
      is_new: p.is_new,
      is_best_seller: p.is_best_seller,
      image_url_1: '',
      image_url_2: '',
    });
    setUploadedFiles(null);
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = new FormData();
      payload.append('name_fr', formData.name_fr);
      payload.append('name_ar', formData.name_ar);
      payload.append('reference', formData.reference);
      payload.append('price', formData.price);
      if (formData.old_price) payload.append('old_price', formData.old_price);
      if (formData.category_id) payload.append('category_id', formData.category_id);
      if (formData.brand_id) payload.append('brand_id', formData.brand_id);
      payload.append('gender', formData.gender);
      payload.append('frame_shape', formData.frame_shape);
      payload.append('description_fr', formData.description_fr);
      payload.append('description_ar', formData.description_ar);
      payload.append('is_available', formData.is_available ? '1' : '0');
      payload.append('is_featured', formData.is_featured ? '1' : '0');
      payload.append('is_new', formData.is_new ? '1' : '0');
      payload.append('is_best_seller', formData.is_best_seller ? '1' : '0');

      // Colors array
      const colorsArr = formData.colors
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);
      colorsArr.forEach((c) => payload.append('colors[]', c));

      // Image URLs
      if (formData.image_url_1) payload.append('image_urls[]', formData.image_url_1);
      if (formData.image_url_2) payload.append('image_urls[]', formData.image_url_2);

      // Uploaded files
      if (uploadedFiles && uploadedFiles.length > 0) {
        for (let i = 0; i < uploadedFiles.length; i++) {
          payload.append('images[]', uploadedFiles[i]);
        }
      }

      if (editingProduct) {
        await updateAdminProduct(editingProduct.id, payload);
      } else {
        await createAdminProduct(payload);
      }

      setIsModalOpen(false);
      setStatusMessage(t('admin.success_saved'));
      loadData();
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la sauvegarde du produit.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm(t('admin.delete_confirm'))) return;
    try {
      await deleteAdminProduct(id);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la suppression.');
    }
  };

  const openGalleryModal = (p: Product) => {
    setGalleryProduct(p);
    setIsGalleryModalOpen(true);
  };

  const handleUploadSingleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!galleryProduct || !e.target.files?.[0]) return;
    try {
      await uploadAdminProductImage(galleryProduct.id, e.target.files[0]);
      await loadData();
      // Refresh current gallery product
      const updated = await getAdminProducts({ search: galleryProduct.reference });
      if (updated.data[0]) setGalleryProduct(updated.data[0]);
    } catch (err: any) {
      alert(err.message || 'Erreur téléversement image.');
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!galleryProduct) return;
    try {
      await deleteAdminProductImage(imageId);
      await loadData();
      const updated = await getAdminProducts({ search: galleryProduct.reference });
      if (updated.data[0]) setGalleryProduct(updated.data[0]);
    } catch (err: any) {
      alert(err.message || 'Erreur suppression image.');
    }
  };

  const handleSetPrimary = async (imageId: number) => {
    if (!galleryProduct) return;
    try {
      await setAdminPrimaryProductImage(imageId);
      await loadData();
      const updated = await getAdminProducts({ search: galleryProduct.reference });
      if (updated.data[0]) setGalleryProduct(updated.data[0]);
    } catch (err: any) {
      alert(err.message || 'Erreur sélection image principale.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-dark-charcoal">
            {t('admin.products')}
          </h2>
          <p className="text-xs text-muted-gray">
            {isRtl
              ? 'إدارة كتالوج النظارات والأسعار والمخزون والصور'
              : 'Gestion des montures, références, prix, disponibilité et galeries photos'}
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-warm-white bg-olive hover:bg-olive-dark rounded-xs transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>{t('admin.add_product')}</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-sm border border-gray-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-gray absolute start-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('catalog.search_placeholder')}
              className="w-full ps-9 pe-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:border-olive"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-2 bg-dark-charcoal text-warm-white text-xs rounded hover:bg-black font-medium"
          >
            {t('admin.search')}
          </button>
        </form>

        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs border border-gray-200 rounded bg-white text-dark-charcoal focus:outline-none focus:border-olive"
          >
            <option value="">{t('catalog.all_categories')}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {getLocalizedText(c, 'name', currentLang)}
              </option>
            ))}
          </select>

          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="px-3 py-2 text-xs border border-gray-200 rounded bg-white text-dark-charcoal focus:outline-none focus:border-olive"
          >
            <option value="">{t('catalog.brands')}</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-sm border border-gray-200 shadow-xs overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Chargement des produits..." />
        ) : productsData && productsData.data.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-[#FAF9F6] border-b border-gray-200 text-muted-gray uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4 text-start">{t('admin.image')}</th>
                  <th className="py-3 px-4 text-start">{isRtl ? 'المنتج / المرجع' : 'Modèle & Réf'}</th>
                  <th className="py-3 px-4 text-start">{t('catalog.categories')}</th>
                  <th className="py-3 px-4 text-start">{t('catalog.brands')}</th>
                  <th className="py-3 px-4 text-start">{isRtl ? 'السعر' : 'Prix'}</th>
                  <th className="py-3 px-4 text-start">{t('admin.status')}</th>
                  <th className="py-3 px-4 text-end">{t('admin.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {productsData.data.map((p) => {
                  const name = getLocalizedText(p, 'name', currentLang);
                  const imgUrl =
                    p.primary_image?.image_url ||
                    p.images?.[0]?.image_url ||
                    '';

                  return (
                    <tr key={p.id} className="hover:bg-warm-white/70 transition-colors">
                      <td className="py-3 px-4">
                        <img
                          src={resolveImageUrl(imgUrl)}
                          alt={name}
                          className="w-12 h-12 object-cover rounded bg-soft-beige border border-gray-200/80"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-dark-charcoal block">
                          {name}
                        </span>
                        <span className="text-[11px] text-muted-gray font-mono">
                          {p.reference}
                        </span>
                        <div className="flex gap-1 mt-0.5">
                          {p.is_featured && (
                            <span className="px-1 text-[9px] bg-amber-100 text-amber-800 rounded">
                              Vedette
                            </span>
                          )}
                          {p.is_new && (
                            <span className="px-1 text-[9px] bg-emerald-100 text-emerald-800 rounded">
                              Nouveau
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-gray">
                        {p.category ? getLocalizedText(p.category, 'name', currentLang) : '—'}
                      </td>
                      <td className="py-3 px-4 text-muted-gray">
                        {p.brand?.name || '—'}
                      </td>
                      <td className="py-3 px-4 font-semibold text-dark-charcoal">
                        {formatPrice(p.price, currentLang)}
                        {p.old_price && (
                          <span className="text-[10px] text-muted-gray block line-through">
                            {formatPrice(p.old_price, currentLang)}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                            p.is_available
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {p.is_available
                            ? t('product.in_stock')
                            : t('product.out_of_stock')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-end">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => openGalleryModal(p)}
                            title="Gérer la galerie photos"
                            className="p-1.5 text-muted-gray hover:text-dark-charcoal hover:bg-gray-100 rounded"
                          >
                            <ImageIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(p)}
                            title={t('admin.edit_product')}
                            className="p-1.5 text-olive hover:text-olive-dark hover:bg-olive/10 rounded"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            title={t('admin.delete')}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-muted-gray">
            {isRtl ? 'لا توجد منتجات مسجلة' : 'Aucun produit trouvé.'}
          </div>
        )}

        {productsData && productsData.last_page > 1 && (
          <div className="p-4 border-t border-gray-100 flex justify-center">
            <Pagination
              currentPage={productsData.current_page}
              lastPage={productsData.last_page}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white w-full max-w-2xl rounded-sm shadow-xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
              <h3 className="font-serif font-bold text-lg text-dark-charcoal">
                {editingProduct ? t('admin.edit_product') : t('admin.add_product')}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-muted-gray hover:text-dark-charcoal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              {/* Product Names FR & AR */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-dark-charcoal mb-1">
                    Nom du modèle (Français) *
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
                    اسم الموديل (العربية) *
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

              {/* Reference & Prices */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium text-dark-charcoal mb-1">
                    Référence SKU *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.reference}
                    onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-olive font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-dark-charcoal mb-1">
                    Prix (MAD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-olive"
                  />
                </div>
                <div>
                  <label className="block font-medium text-dark-charcoal mb-1">
                    Ancien Prix (Promo)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.old_price}
                    onChange={(e) => setFormData({ ...formData, old_price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-olive"
                  />
                </div>
              </div>

              {/* Category, Brand, Gender, Shape */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block font-medium text-dark-charcoal mb-1">
                    Catégorie
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-2.5 py-2 border border-gray-200 rounded focus:outline-none focus:border-olive bg-white"
                  >
                    <option value="">Sélectionner</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name_fr}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-dark-charcoal mb-1">
                    Marque
                  </label>
                  <select
                    value={formData.brand_id}
                    onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
                    className="w-full px-2.5 py-2 border border-gray-200 rounded focus:outline-none focus:border-olive bg-white"
                  >
                    <option value="">Sélectionner</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-dark-charcoal mb-1">
                    Genre
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-2.5 py-2 border border-gray-200 rounded focus:outline-none focus:border-olive bg-white capitalize"
                  >
                    <option value="unisexe">Unisexe</option>
                    <option value="homme">Homme</option>
                    <option value="femme">Femme</option>
                    <option value="enfant">Enfant</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-dark-charcoal mb-1">
                    Forme monture
                  </label>
                  <select
                    value={formData.frame_shape}
                    onChange={(e) => setFormData({ ...formData, frame_shape: e.target.value })}
                    className="w-full px-2.5 py-2 border border-gray-200 rounded focus:outline-none focus:border-olive bg-white capitalize"
                  >
                    <option value="rectangle">Rectangle</option>
                    <option value="rond">Rond</option>
                    <option value="carre">Carré</option>
                    <option value="aviateur">Aviateur</option>
                    <option value="cat-eye">Cat-eye</option>
                    <option value="pantoo">Pantos</option>
                  </select>
                </div>
              </div>

              {/* Colors */}
              <div>
                <label className="block font-medium text-dark-charcoal mb-1">
                  Couleurs disponibles (séparées par une virgule)
                </label>
                <input
                  type="text"
                  value={formData.colors}
                  onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                  placeholder="Noir, Écaille, Doré, Ambre"
                  className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-olive"
                />
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-dark-charcoal mb-1">
                    Description (Français)
                  </label>
                  <textarea
                    rows={3}
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
                    rows={3}
                    dir="rtl"
                    value={formData.description_ar}
                    onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-olive font-arabic"
                  />
                </div>
              </div>

              {/* File upload or external Image URLs */}
              <div className="p-4 bg-warm-white rounded border border-gray-200 space-y-3">
                <label className="block font-semibold text-dark-charcoal">
                  Ajouter des images au produit
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setUploadedFiles(e.target.files)}
                    className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-olive file:text-white hover:file:bg-olive-dark cursor-pointer"
                  />
                </div>
                <div className="pt-2 text-[11px] text-muted-gray">
                  Ou saisir une URL d'image web :
                </div>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={formData.image_url_1}
                  onChange={(e) => setFormData({ ...formData, image_url_1: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs border border-gray-200 rounded bg-white"
                />
              </div>

              {/* Flags Checkboxes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={formData.is_available}
                    onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                    className="rounded border-gray-300 text-olive focus:ring-olive w-4 h-4"
                  />
                  <span>En stock</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="rounded border-gray-300 text-olive focus:ring-olive w-4 h-4"
                  />
                  <span>Vedette</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={formData.is_new}
                    onChange={(e) => setFormData({ ...formData, is_new: e.target.checked })}
                    className="rounded border-gray-300 text-olive focus:ring-olive w-4 h-4"
                  />
                  <span>Nouveau</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={formData.is_best_seller}
                    onChange={(e) => setFormData({ ...formData, is_best_seller: e.target.checked })}
                    className="rounded border-gray-300 text-olive focus:ring-olive w-4 h-4"
                  />
                  <span>Bestseller</span>
                </label>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded text-dark-charcoal hover:bg-gray-100 font-medium"
                >
                  {t('admin.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-olive text-warm-white rounded font-semibold hover:bg-olive-dark shadow-xs disabled:opacity-50"
                >
                  {submitting ? t('admin.saving') : t('admin.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Manager Modal */}
      {isGalleryModalOpen && galleryProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white w-full max-w-xl rounded-sm shadow-xl p-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
              <h3 className="font-serif font-bold text-base text-dark-charcoal">
                Galerie photos : {galleryProduct.name_fr} ({galleryProduct.reference})
              </h3>
              <button
                onClick={() => setIsGalleryModalOpen(false)}
                className="p-1 text-muted-gray hover:text-dark-charcoal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Images List */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {galleryProduct.images && galleryProduct.images.length > 0 ? (
                galleryProduct.images.map((img) => (
                  <div
                    key={img.id}
                    className="relative group aspect-square rounded overflow-hidden border border-gray-200 bg-soft-beige"
                  >
                    <img
                      src={resolveImageUrl(img.image_url)}
                      alt="Product"
                      className="w-full h-full object-cover"
                    />

                    {img.is_primary && (
                      <span className="absolute top-1.5 start-1.5 px-1.5 py-0.5 text-[9px] font-bold bg-olive text-white rounded">
                        {t('admin.primary')}
                      </span>
                    )}

                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {!img.is_primary && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimary(img.id)}
                          title={t('admin.set_primary')}
                          className="p-1.5 bg-white text-dark-charcoal rounded hover:bg-olive hover:text-white transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(img.id)}
                        title={t('admin.delete')}
                        className="p-1.5 bg-white text-red-600 rounded hover:bg-red-600 hover:text-white transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-6 text-center text-xs text-muted-gray">
                  Aucune image enregistrée pour ce produit.
                </div>
              )}
            </div>

            {/* Upload New Image */}
            <div className="pt-4 border-t border-gray-100">
              <label className="block text-xs font-semibold text-dark-charcoal mb-2">
                {t('admin.upload_image')}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadSingleImage}
                className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-dark-charcoal file:text-white hover:file:bg-black cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
