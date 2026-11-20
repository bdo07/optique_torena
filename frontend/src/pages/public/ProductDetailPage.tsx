import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Shield,
  Sparkles,
  MapPin,
  Clock,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { getProduct } from '../../api/endpoints';
import { Product } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { ProductCard } from '../../components/common/ProductCard';
import { useSettings } from '../../context/SettingsContext';
import {
  buildProductWhatsAppMessage,
  buildWhatsAppLink,
  formatPrice,
  getLocalizedText,
  resolveImageUrl,
} from '../../utils/formatters';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const { contactInfo } = useSettings();
  const currentLang = (i18n.language || 'fr') as 'fr' | 'ar';
  const isRtl = i18n.language === 'ar';

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    async function fetchProductData() {
      if (!slug) return;
      setLoading(true);
      setError(false);
      try {
        const data = await getProduct(slug);
        setProduct(data.product);
        setRelated(data.related || []);
        setSelectedImageIndex(0);
      } catch (err) {
        console.error('Failed to load product details', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchProductData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return <LoadingSpinner text="Chargement de la monture..." />;
  }

  if (error || !product) {
    return (
      <div className="py-20 max-w-7xl mx-auto px-4">
        <EmptyState
          title="Monture introuvable"
          description="Le modèle recherché n'est plus disponible ou a été déplacé."
          actionText={t('home.all_products')}
          onAction={() => window.location.assign('/catalogue')}
        />
      </div>
    );
  }

  const productName = getLocalizedText(product, 'name', currentLang);
  const productDescription = getLocalizedText(product, 'description', currentLang);
  const categoryName = product.category
    ? getLocalizedText(product.category, 'name', currentLang)
    : '';
  const brandName = product.brand?.name || '';

  const imagesList =
    product.images && product.images.length > 0
      ? product.images.map((img) => img.image_url)
      : ['https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=1000&q=80'];

  const currentImage = imagesList[selectedImageIndex] || imagesList[0];

  const hasDiscount = product.old_price && product.old_price > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.old_price! - product.price) / product.old_price!) * 100)
    : 0;

  const whatsAppMessage = buildProductWhatsAppMessage(
    productName,
    product.reference,
    product.price,
    currentLang
  );
  const whatsAppLink = buildWhatsAppLink(contactInfo.whatsappNumber, whatsAppMessage);

  const BreadcrumbArrow = isRtl ? ChevronLeft : ChevronRight;
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="bg-warm-white min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav
          className="flex items-center gap-2 text-xs text-muted-gray mb-8 overflow-x-auto whitespace-nowrap"
          aria-label="Fil d'Ariane"
        >
          <Link to="/" className="hover:text-dark-charcoal transition-colors">
            {t('nav.home')}
          </Link>
          <BreadcrumbArrow className="w-3.5 h-3.5 shrink-0" />
          <Link to="/catalogue" className="hover:text-dark-charcoal transition-colors">
            {t('nav.catalog')}
          </Link>
          {product.category && (
            <>
              <BreadcrumbArrow className="w-3.5 h-3.5 shrink-0" />
              <Link
                to={`/catalogue?category=${product.category.slug}`}
                className="hover:text-dark-charcoal transition-colors"
              >
                {categoryName}
              </Link>
            </>
          )}
          <BreadcrumbArrow className="w-3.5 h-3.5 shrink-0" />
          <span className="text-dark-charcoal font-medium truncate max-w-xs">
            {productName}
          </span>
        </nav>

        {/* Main Product Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 bg-white p-6 sm:p-10 rounded-sm border border-gray-200/80 shadow-xs mb-16">
          {/* Gallery Column */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnails list */}
            {imagesList.length > 1 && (
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[500px] shrink-0">
                {imagesList.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xs overflow-hidden border-2 transition-all shrink-0 bg-warm-white ${
                      selectedImageIndex === idx
                        ? 'border-olive shadow-xs ring-1 ring-olive/40'
                        : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={resolveImageUrl(imgUrl)}
                      alt={`${productName} thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover object-center"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Stage Image */}
            <div className="relative flex-1 aspect-4/3 sm:aspect-square bg-warm-white rounded-xs overflow-hidden border border-gray-100 flex items-center justify-center">
              <img
                src={resolveImageUrl(currentImage)}
                alt={productName}
                className="w-full h-full object-cover object-center transition-all duration-300"
              />

              {/* Badges */}
              <div className="absolute top-4 start-4 flex flex-col gap-1.5 z-10">
                {product.is_new && (
                  <span className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider bg-olive text-warm-white rounded-xs shadow-xs">
                    {t('catalog.badge_new')}
                  </span>
                )}
                {product.is_best_seller && (
                  <span className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider bg-dark-charcoal text-warm-white rounded-xs shadow-xs">
                    {t('catalog.badge_bestseller')}
                  </span>
                )}
                {hasDiscount && (
                  <span className="px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider bg-amber-700 text-warm-white rounded-xs shadow-xs">
                    -{discountPercentage}%
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Details & Actions Column */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              {/* Brand & Reference */}
              <div className="flex items-center justify-between text-xs text-muted-gray mb-2">
                <span className="font-semibold uppercase tracking-widest text-olive">
                  {brandName || 'Optique Torena'}
                </span>
                <span className="font-mono text-xs">
                  {t('product.reference')}: {product.reference}
                </span>
              </div>

              {/* Model Name */}
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-dark-charcoal tracking-tight mb-3">
                {productName}
              </h1>

              {/* Price section */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl sm:text-3xl font-bold text-dark-charcoal tracking-tight">
                  {formatPrice(product.price, currentLang)}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-muted-gray line-through">
                    {formatPrice(product.old_price, currentLang)}
                  </span>
                )}
              </div>

              {/* Availability Status */}
              <div className="flex items-center gap-2 mb-6 text-xs">
                {product.is_available ? (
                  <span className="inline-flex items-center gap-1.5 text-emerald-700 font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t('product.in_stock')}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-amber-700 font-medium">
                    <AlertCircle className="w-4 h-4" />
                    <span>{t('product.out_of_stock')}</span>
                  </span>
                )}
              </div>

              {/* Attributes Pills */}
              <div className="flex flex-wrap gap-2 text-xs text-dark-charcoal mb-6">
                {categoryName && (
                  <span className="px-3 py-1 bg-soft-beige rounded-xs">
                    {categoryName}
                  </span>
                )}
                {product.gender && (
                  <span className="px-3 py-1 bg-soft-beige rounded-xs capitalize">
                    {product.gender}
                  </span>
                )}
                {product.frame_shape && (
                  <span className="px-3 py-1 bg-soft-beige rounded-xs capitalize">
                    {product.frame_shape}
                  </span>
                )}
              </div>

              {/* Colors list if present */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <span className="text-xs font-semibold uppercase tracking-wider text-dark-charcoal block mb-2">
                    {t('product.colors_available')}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.colors.map((colorName, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 text-xs border border-gray-200 rounded bg-white text-dark-charcoal"
                      >
                        {colorName}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {productDescription && (
                <div className="mb-6 text-xs sm:text-sm text-muted-gray leading-relaxed border-t border-gray-100 pt-4">
                  <p>{productDescription}</p>
                </div>
              )}
            </div>

            {/* Direct WhatsApp Contact CTA */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <a
                href={whatsAppLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 bg-olive hover:bg-olive-dark text-warm-white font-semibold text-xs sm:text-sm uppercase tracking-wider rounded-xs transition-colors shadow-sm"
              >
                <MessageCircle className="w-5 h-5" />
                <span>{t('product.contact_whatsapp')}</span>
              </a>

              {/* Boutique advice prompt */}
              <div className="p-3.5 bg-soft-beige/70 rounded-xs border border-gray-200/60 text-xs text-dark-charcoal flex items-start gap-3">
                <MapPin className="w-4 h-4 text-olive shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  {t('product.boutique_try_on')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications Tab / Section */}
        {product.specifications && Object.keys(product.specifications).length > 0 && (
          <div className="bg-white p-6 sm:p-8 rounded-sm border border-gray-200/80 shadow-xs mb-16">
            <h3 className="text-lg font-serif font-bold text-dark-charcoal mb-4">
              {t('product.specifications')}
            </h3>
            <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 text-xs">
              {Object.entries(product.specifications).map(([key, val]) => (
                <div key={key} className="border-b border-gray-100 pb-2">
                  <dt className="text-muted-gray uppercase tracking-wider text-[11px] mb-0.5">
                    {key}
                  </dt>
                  <dd className="font-medium text-dark-charcoal">{String(val)}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-dark-charcoal">
                {t('product.related_title')}
              </h3>
              <Link
                to="/catalogue"
                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-olive hover:text-olive-dark transition-colors"
              >
                <span>{t('home.all_products')}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
