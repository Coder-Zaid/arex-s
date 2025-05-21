import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ProductCard from '@/components/ProductCard';
import { Search, ChevronLeft, Filter } from 'lucide-react';
import { useAppSettings } from '@/context/AppSettingsContext';
import { useProducts } from '@/context/ProductContext';
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from '@/components/ui/drawer';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const SearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { language } = useAppSettings();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<number[]>([0, 10000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const { products } = useProducts();
  
  const categories = Array.from(new Set(products.map(product => product.category)));
  const brands = Array.from(new Set(products.map(product => product.brand)));
  const minPrice = Math.min(...products.map(p => p.price));
  const maxPrice = Math.max(...products.map(p => p.price));
  
  const filteredProducts = products.filter(product => {
    const matchesQuery = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === null || product.category === activeCategory;
    const matchesPrice = product.price >= (priceRange[0] as number) && product.price <= (priceRange[1] as number);
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    const matchesRating = selectedRating === null || Math.floor(product.rating) === selectedRating;
    return matchesQuery && matchesCategory && matchesPrice && matchesBrand && matchesRating;
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromUrl = params.get('category');
    if (categoryFromUrl) {
      // Find the display name for the slug
      const match = categories.find(cat => cat.toLowerCase().replace(/\s+/g, '-') === categoryFromUrl);
      if (match) setActiveCategory(match);
    }
  }, [location.search, categories]);

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
        <Drawer open={isDrawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerTrigger asChild>
            <Button variant="ghost" size="icon" className="ml-2">
              <Filter />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{language === 'ar' ? 'تصفية المنتجات' : 'Filter Products'}</DrawerTitle>
            </DrawerHeader>
            <div className="p-4 space-y-6">
              {/* Price Range */}
              <div>
                <div className="font-medium mb-2">{language === 'ar' ? 'السعر' : 'Price'}</div>
                <Slider
                  min={minPrice}
                  max={maxPrice}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  step={1}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs">
                  <span>{minPrice}</span>
                  <span>{maxPrice}</span>
                </div>
              </div>
              {/* Brand */}
              <div>
                <div className="font-medium mb-2">{language === 'ar' ? 'العلامة التجارية' : 'Brand'}</div>
                <div className="flex flex-wrap gap-2">
                  {brands.map(brand => (
                    <div key={brand} className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedBrands.includes(brand)}
                        onCheckedChange={checked => {
                          setSelectedBrands(prev => checked ? [...prev, brand] : prev.filter(b => b !== brand));
                        }}
                      />
                      <span>{brand}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Rating */}
              <div>
                <div className="font-medium mb-2">{language === 'ar' ? 'التقييم' : 'Rating'}</div>
                <RadioGroup value={selectedRating?.toString() || ''} onValueChange={val => setSelectedRating(val ? parseInt(val) : null)} className="flex gap-2">
                  {[5, 4, 3, 2, 1].map(rating => (
                    <RadioGroupItem key={rating} value={rating.toString()} id={`rating-${rating}`} />
                  ))}
                </RadioGroup>
              </div>
            </div>
            <DrawerFooter>
              <Button onClick={() => setDrawerOpen(false)}>{language === 'ar' ? 'تطبيق' : 'Apply'}</Button>
              <DrawerClose asChild>
                <Button variant="outline" onClick={() => {
                  setPriceRange([minPrice, maxPrice]);
                  setSelectedBrands([]);
                  setSelectedRating(null);
                }}>{language === 'ar' ? 'إعادة تعيين' : 'Reset'}</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
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
            onClick={() => {
              setActiveCategory(null);
              navigate('/search');
            }}
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
              onClick={() => {
                setActiveCategory(category);
                navigate(`/search?category=${category.toLowerCase().replace(/\s+/g, '-')}`);
              }}
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
