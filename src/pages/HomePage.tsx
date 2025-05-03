
import React from 'react';
import BannerSlider from '@/components/BannerSlider';
import ProductCard from '@/components/ProductCard';
import { products, banners } from '@/data/products';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAppSettings } from '@/context/AppSettingsContext';

const HomePage = () => {
  // Filter products for each section
  const featuredProducts = products.filter(p => p.featured);
  const newProducts = products.filter(p => p.isNew);
  const saleProducts = products.filter(p => p.onSale);
  const { currencySymbol } = useAppSettings();
  
  return (
    <div className="pb-20">
      {/* Banner Slider */}
      <section className="my-4">
        <BannerSlider banners={banners} />
      </section>
      
      {/* Featured Products */}
      <section className="my-6 px-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-lg text-foreground">Featured Products</h2>
          <Link to="/category/featured" className="text-brand-blue text-sm flex items-center">
            View all <ArrowRight size={14} className="ml-1" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {featuredProducts.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      
      {/* New Arrivals */}
      <section className="my-6 px-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-lg text-foreground">New Arrivals</h2>
          <Link to="/category/new" className="text-brand-blue text-sm flex items-center">
            View all <ArrowRight size={14} className="ml-1" />
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
          <h2 className="font-bold text-lg text-foreground">Flash Deals</h2>
          <Link to="/category/sale" className="text-brand-blue text-sm flex items-center">
            View all <ArrowRight size={14} className="ml-1" />
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
          <h2 className="font-bold text-lg text-foreground">Browse Categories</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {['TV', 'Audio', 'Computers', 'Wearables', 'Smart Home', 'Appliances'].map((category) => (
            <Link key={category} to={`/category/${category.toLowerCase()}`}>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 text-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <span className="font-medium text-foreground">{category}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
