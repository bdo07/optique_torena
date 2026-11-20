import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Glasses,
  CheckCircle2,
  AlertTriangle,
  FolderTree,
  Tag,
  Star,
  Mail,
  Plus,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { StatCard } from '../../components/admin/StatCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { getAdminStats } from '../../api/endpoints';
import { ContactMessage, Product } from '../../types';
import { formatPrice, getLocalizedText, resolveImageUrl } from '../../utils/formatters';

export const AdminDashboardPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = (i18n.language || 'fr') as 'fr' | 'ar';
  const isRtl = i18n.language === 'ar';

  const [stats, setStats] = useState<any>(null);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getAdminStats();
        setStats(data.stats);
        setRecentProducts(data.recent_products || []);
        setRecentMessages(data.recent_messages || []);
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Chargement du tableau de bord..." />;
  }

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-8">
      {/* Quick Action Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-dark-charcoal">
            {t('admin.overview')}
          </h2>
          <p className="text-xs text-muted-gray">
            {isRtl
              ? 'مرحباً بكم في لوحة إدارة أوبتيك تورينا'
              : 'Bienvenue sur la console d\'administration Optique Torena'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-warm-white bg-olive hover:bg-olive-dark rounded-xs transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{t('admin.add_product')}</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t('admin.total_products')}
          value={stats?.total_products || 0}
          icon={<Glasses className="w-5 h-5" />}
        />
        <StatCard
          title={t('admin.available_products')}
          value={stats?.available_products || 0}
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
        />
        <StatCard
          title={t('admin.out_of_stock')}
          value={stats?.out_of_stock || 0}
          icon={<AlertTriangle className="w-5 h-5 text-amber-600" />}
        />
        <StatCard
          title={t('admin.featured_products')}
          value={stats?.featured_products || 0}
          icon={<Star className="w-5 h-5 text-amber-500" />}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title={t('admin.total_categories')}
          value={stats?.total_categories || 0}
          icon={<FolderTree className="w-5 h-5" />}
        />
        <StatCard
          title={t('admin.total_brands')}
          value={stats?.total_brands || 0}
          icon={<Tag className="w-5 h-5" />}
        />
        <StatCard
          title={t('admin.unread_messages')}
          value={stats?.unread_messages || 0}
          icon={<Mail className="w-5 h-5 text-indigo-600" />}
        />
      </div>

      {/* Recent Items Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Products */}
        <div className="lg:col-span-7 bg-white p-6 rounded-sm border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <h3 className="font-semibold text-sm text-dark-charcoal">
              {isRtl ? 'أحدث المنتجات المضافة' : 'Derniers modèles ajoutés'}
            </h3>
            <Link
              to="/admin/products"
              className="text-xs text-olive hover:underline inline-flex items-center gap-1 font-medium"
            >
              <span>{isRtl ? 'عرض الكل' : 'Voir tout'}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {recentProducts.map((p) => {
              const name = getLocalizedText(p, 'name', currentLang);
              const imgUrl =
                p.primary_image?.image_url ||
                p.images?.[0]?.image_url ||
                '';

              return (
                <div
                  key={p.id}
                  className="py-3 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={resolveImageUrl(imgUrl)}
                      alt={name}
                      className="w-10 h-10 object-cover rounded bg-warm-white shrink-0"
                    />
                    <div className="min-w-0">
                      <Link
                        to={`/admin/products`}
                        className="text-xs font-semibold text-dark-charcoal hover:text-olive truncate block"
                      >
                        {name}
                      </Link>
                      <span className="text-[11px] text-muted-gray font-mono">
                        {p.reference}
                      </span>
                    </div>
                  </div>

                  <div className="text-end shrink-0">
                    <span className="text-xs font-semibold text-dark-charcoal block">
                      {formatPrice(p.price, currentLang)}
                    </span>
                    <span
                      className={`text-[10px] ${
                        p.is_available ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                    >
                      {p.is_available
                        ? t('product.in_stock')
                        : t('product.out_of_stock')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="lg:col-span-5 bg-white p-6 rounded-sm border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <h3 className="font-semibold text-sm text-dark-charcoal">
              {isRtl ? 'رسائل واستفسارات العملاء' : 'Derniers messages reçus'}
            </h3>
            <Link
              to="/admin/messages"
              className="text-xs text-olive hover:underline inline-flex items-center gap-1 font-medium"
            >
              <span>{isRtl ? 'عرض الكل' : 'Voir tout'}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {recentMessages.length === 0 ? (
              <p className="text-xs text-muted-gray py-6 text-center">
                {isRtl ? 'لا توجد رسائل جديدة' : 'Aucun nouveau message.'}
              </p>
            ) : (
              recentMessages.map((msg) => (
                <div key={msg.id} className="py-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-dark-charcoal">
                      {msg.name}
                    </span>
                    {!msg.is_read && (
                      <span className="px-1.5 py-0.5 text-[9px] font-semibold bg-olive/15 text-olive rounded">
                        {isRtl ? 'جديد' : 'Nouveau'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-gray line-clamp-2">
                    {msg.message}
                  </p>
                  {msg.phone && (
                    <span className="text-[11px] text-gray-500 block">
                      {msg.phone}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
