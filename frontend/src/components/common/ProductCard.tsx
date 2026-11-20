import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MessageCircle } from 'lucide-react';
import { Product } from '../../types';
import {
  buildProductWhatsAppMessage,
  buildWhatsAppLink,
  formatPrice,
  getLocalizedText,
  resolveImageUrl,
} from '../../utils/formatters';
import { useSettings } from '../../context/SettingsContext';

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { t, i18n } = useTranslation();
  const { contactInfo } = useSettings();
  const currentLang = (i18n.language || 'fr') as 'fr' | 'ar';

  const productName = getLocalizedText(product, 'name', currentLang);
  const categoryName = product.category
    ? getLocalizedText(product.category, 'name', currentLang)
    : '';
  const brandName = product.brand?.name || '';

  const primaryImage =
    product.primary_image?.image_url ||
    product.images?.[0]?.image_url ||
    null;
  const secondaryImage =
    product.images && product.images.length > 1
      ? product.images[1].image_url
      : null;

  const hasDiscount =
    product.old_price && product.old_price > product.price;

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

  return (
    <div className="group flex flex-col bg-white border border-gray-200/80 rounded-sm overflow-hidden hover:shadow-card hover:border-gray-300 transition-all duration-300">
      {/* Image Container with Badges */}
      <Link
        to={`/produit/${product.slug}`}
        className="relative block aspect-4/3 bg-warm-white overflow-hidden"
      >
        <img
          src={resolveImageUrl(primaryImage)}
          alt={productName}
          className={`w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105 ${
            secondaryImage ? 'group-hover:opacity-0' : ''
          }`}
          loading="lazy"
        />

        {secondaryImage && (
          <img
            src={resolveImageUrl(secondaryImage)}
            alt={`${productName} vue secondaire`}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            loading="lazy"
          />
        )}

        {/* Badges Overlay */}
        <div className="absolute top-2.5 start-2.5 flex flex-col gap-1 z-10">
          {product.is_new && (
            <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-olive text-warm-white rounded-xs shadow-xs">
              {t('catalog.badge_new')}
            </span>
          )}
          {product.is_best_seller && (
            <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-dark-charcoal text-warm-white rounded-xs shadow-xs">
              {t('catalog.badge_bestseller')}
            </span>
          )}
          {hasDiscount && (
            <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-amber-700 text-warm-white rounded-xs shadow-xs">
              -{discountPercentage}%
            </span>
          )}
          {!product.is_available && (
            <span className="px-2 py-0.5 text-[10px] font-medium tracking-wider uppercase bg-gray-600 text-white rounded-xs">
              {t('product.out_of_stock')}
            </span>
          )}
        </div>
      </Link>

      {/* Content Container */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-xs text-muted-gray mb-1">
            <span className="font-medium uppercase tracking-wider text-[11px] text-olive">
              {brandName || 'Optique Torena'}
            </span>
            <span className="text-[11px]">{categoryName}</span>
          </div>

          {/* Product Name */}
          <Link
            to={`/produit/${product.slug}`}
            className="block font-medium text-dark-charcoal hover:text-olive transition-colors text-sm line-clamp-1 mb-1"
          >
            {productName}
          </Link>

          {/* Reference */}
          <p className="text-[11px] text-muted-gray tracking-wide mb-3">
            {t('product.reference')}: {product.reference}
          </p>
        </div>

        {/* Price & Action row */}
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-base font-semibold text-dark-charcoal tracking-tight">
              {formatPrice(product.price, currentLang)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-muted-gray line-through -mt-0.5">
                {formatPrice(product.old_price, currentLang)}
              </span>
            )}
          </div>

          {/* Quick WhatsApp Action Button */}
          <a
            href={whatsAppLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title={t('catalog.ask_whatsapp')}
            className="p-2 text-olive hover:text-warm-white hover:bg-olive border border-olive/30 rounded transition-colors"
            aria-label={t('catalog.ask_whatsapp')}
          >
            <MessageCircle className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
