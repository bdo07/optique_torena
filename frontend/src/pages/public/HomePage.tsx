import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { HeroSection } from '../../components/home/HeroSection';
import { ValuesSection } from '../../components/home/ValuesSection';
import { CategoriesGrid } from '../../components/home/CategoriesGrid';
import { FeaturedSection } from '../../components/home/FeaturedSection';
import { PromoBanner } from '../../components/home/PromoBanner';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { getCategories, getProducts, getPromotions } from '../../api/endpoints';
import { Category, Product, Promotion } from '../../types';
import { useSettings } from '../../context/SettingsContext';
import { resolveImageUrl } from '../../utils/formatters';

export const HomePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { getSetting } = useSettings();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const isRtl = i18n.language === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [catsData, prodsData, promosData] = await Promise.all([
          getCategories(),
          getProducts({ per_page: 8 }),
          getPromotions(),
        ]);
        setCategories(catsData);
        setFeaturedProducts(prodsData.data);
        setPromotions(promosData);
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    }

    loadHomeData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Chargement d'Optique Torena..." />;
  }

  const aboutTitle = getSetting('about_title', t('about.title'));
  const aboutTextP1 = getSetting('about_text_p1', t('about.p1'));
  const aboutImage = resolveImageUrl(
    getSetting(
      'about_image',
      'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=1200&q=80'
    )
  );

  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* Values & Guarantees */}
      <ValuesSection />

      {/* Categories Grid */}
      <CategoriesGrid categories={categories} />

      {/* Featured Products Showcase */}
      <FeaturedSection products={featuredProducts} />

      {/* Promotional Banner (if any active promotion) */}
      {promotions.length > 0 && <PromoBanner promotion={promotions[0]} />}

      {/* Editorial About Teaser */}
      <section className="py-20 bg-warm-white border-t border-gray-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 relative aspect-4/3 rounded-sm overflow-hidden bg-soft-beige shadow-card">
              <img
                src={aboutImage}
                alt={aboutTitle}
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </div>

            <div className="lg:col-span-6 lg:ps-6">
              <span className="text-xs uppercase tracking-widest text-olive font-semibold block mb-3">
                {t('nav.about')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-dark-charcoal leading-tight mb-6">
                {aboutTitle}
              </h2>
              <p className="text-sm text-muted-gray leading-relaxed mb-6">
                {aboutTextP1}
              </p>
              <Link
                to="/a-propos"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-olive hover:text-olive-dark transition-colors"
              >
                <span>{t('home.explore')}</span>
                <ArrowIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
