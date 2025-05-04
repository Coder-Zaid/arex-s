
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { Search, ChevronLeft, Filter } from 'lucide-react';
import { useAppSettings } from '@/context/AppSettingsContext';

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { language } = useAppSettings();
  
  const categories = Array.from(new Set(products.map(product => product.category)));
  
  const filteredProducts = products.filter(product => {
    const matchesQuery = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = activeCategory === null || product.category === activeCategory;
    
    return matchesQuery && matchesCategory;
  });

  // Format number based on language
  const formatNumber = (num: number) => {
    if (language === 'ar') {
      // Convert to Arabic numerals
      return num.toString().replace(/\d/g, (d) => 
        String.fromCharCode(1632 + parseInt(d)));
    }
    return num.toString();
  };
  
  return (
    <div className="pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background shadow-sm p-3 flex items-center">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft />
        </Button>
        <div className="flex-1 relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            type="search" 
            placeholder={language === 'ar' ? 'البحث عن المنتجات...' : 'Search products...'}
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="ghost" size="icon" className="ml-2">
          <Filter />
        </Button>
      </div>
      
      {/* Categories */}
      <div className="p-4">
        <div className="overflow-x-auto flex gap-2 pb-2 no-scrollbar">
          <button
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
              activeCategory === null 
                ? 'bg-brand-blue text-white' 
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
            onClick={() => setActiveCategory(null)}
          >
            {language === 'ar' ? 'الكل' : 'All'}
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                activeCategory === category 
                  ? 'bg-brand-blue text-white' 
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
              }`}
              onClick={() => setActiveCategory(category)}
            >
              {language === 'ar' ? {
                'TV': 'تلفزيون',
                'Audio': 'صوتيات',
                'Computers': 'حواسيب',
                'Wearables': 'أجهزة قابلة للارتداء',
                'Smart Home': 'المنزل الذكي',
                'Appliances': 'أجهزة منزلية'
              }[category] || category : category}
            </button>
          ))}
        </div>
      </div>
      
      {/* Search Results */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold">
            {searchQuery 
              ? (language === 'ar' 
                ? `نتائج "${searchQuery}"` 
                : `Results for "${searchQuery}"`) 
              : (language === 'ar' ? 'جميع المنتجات' : 'All Products')}
            {activeCategory && (language === 'ar' 
              ? ` في ${
                {
                  'TV': 'تلفزيون',
                  'Audio': 'صوتيات',
                  'Computers': 'حواسيب',
                  'Wearables': 'أجهزة قابلة للارتداء',
                  'Smart Home': 'المنزل الذكي',
                  'Appliances': 'أجهزة منزلية'
                }[activeCategory] || activeCategory
              }` 
              : ` in ${activeCategory}`
            )}
          </h2>
          <span className="text-sm text-gray-500">{language === 'ar' ? formatNumber(filteredProducts.length) + ' منتج' : `${filteredProducts.length} results`}</span>
        </div>
        
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">{language === 'ar' ? 'لا توجد منتجات' : 'No products found'}</p>
            <Button onClick={() => {setSearchQuery(''); setActiveCategory(null);}}>
              {language === 'ar' ? 'مسح البحث' : 'Clear search'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
