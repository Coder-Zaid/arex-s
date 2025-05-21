import React from 'react';
import { TopNavBar } from '@/components/layout/TopNavBar';
import { CategoryNavBar } from '@/components/layout/CategoryNavBar';
import { CategoryShortcuts } from '@/components/layout/CategoryShortcuts';
import BannerSlider from '@/components/BannerSlider';
import ProductCard from '@/components/ProductCard';
import { banners } from '@/data/products';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAppSettings } from '@/context/AppSettingsContext';
import { useProducts } from '@/context/ProductContext';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { getUniqueCategories } from '@/components/layout/CategoryNavBar';

const HomePage = () => {
  const { products } = useProducts();
  // Filter products for each section
  const featuredProducts = products.filter(p => p.featured);
  const newProducts = products.filter(p => p.isNew);
  const saleProducts = products.filter(p => p.onSale);
  const { currencySymbol, language, translations, isRtl } = useAppSettings();
  const t = translations[language];
  
  // Get unique categories and add 'Jewellery' if not present
  let categories: string[] = getUniqueCategories(products) as string[];
  if (!categories.includes('Jewellery')) categories.push('Jewellery');

  return (
    <ResponsiveLayout>
      <TopNavBar />
      <CategoryNavBar />
      <CategoryShortcuts />
      {/* Banner Slider */}
      <section className="my-4 px-4">
        <BannerSlider banners={banners} />
      </section>
      {/* Featured Products */}
      <section className="my-6 px-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-lg text-foreground">{t.featuredProducts}</h2>
          <Link to="/category/featured" className="text-brand-blue text-sm flex items-center">
            {t.viewAll} {isRtl ? <ArrowRight size={14} className="mr-1 transform rotate-180" /> : <ArrowRight size={14} className="ml-1" />}
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      {/* New Arrivals */}
      <section className="my-6 px-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-lg text-foreground">{t.newArrivals}</h2>
          <Link to="/category/new" className="text-brand-blue text-sm flex items-center">
            {t.viewAll} {isRtl ? <ArrowRight size={14} className="mr-1 transform rotate-180" /> : <ArrowRight size={14} className="ml-1" />}
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {newProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      {/* Flash Deals */}
      <section className="my-6 px-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-lg text-foreground">{t.flashDeals}</h2>
          <Link to="/category/sale" className="text-brand-blue text-sm flex items-center">
            {t.viewAll} {isRtl ? <ArrowRight size={14} className="mr-1 transform rotate-180" /> : <ArrowRight size={14} className="ml-1" />}
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {saleProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      {/* Categories */}
      <section className="my-6 px-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-lg text-foreground">{t.browseCategories}</h2>
          <Link to="/categories">
            <button className="bg-brand-blue text-white px-4 py-2 rounded-full font-medium text-sm hover:bg-blue-700 transition">
              Categories
            </button>
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((category) => (
            <Link key={category} to={category === 'Jewellery' ? '/jewellery' : `/search?category=${encodeURIComponent(category.toLowerCase().replace(/\s+/g, '-'))}`}>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <span className="font-medium text-black dark:text-white">{category}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </ResponsiveLayout>
  );
};

export default HomePage;
