import { useProducts } from '@/context/ProductContext';
import { getUniqueCategories } from './CategoryNavBar';
import { Link } from 'react-router-dom';
import { Globe, Percent, Home, Watch, ShoppingBag, Gift, ShoppingCart, Tag } from 'lucide-react';

const icons = [Globe, Percent, Home, Watch, ShoppingBag, Gift, ShoppingCart];

export const CategoryShortcuts = () => {
  const { products } = useProducts();
  const categories = getUniqueCategories(products);
  const hasJewellery = categories.includes('Jewellery');

  return (
    <div className="flex gap-4 px-4 py-3 overflow-x-auto bg-transparent justify-end no-scrollbar md:scrollbar-thin md:scrollbar-thumb-blue-400 md:scrollbar-track-blue-100" style={{ WebkitOverflowScrolling: 'touch', paddingBottom: 12 }}>
      {categories.map((cat, i) => {
        const Icon = icons[i] || Tag;
        return (
          <Link
            key={cat}
            to={`/search?category=${encodeURIComponent(cat.toLowerCase().replace(/\s+/g, '-'))}`}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/90 shadow-lg font-semibold text-blue-700 hover:bg-blue-100 transition-all border border-blue-100 backdrop-blur-md"
            style={{ fontFamily: 'Poppins, Montserrat, Arial, sans-serif', fontSize: '1rem', boxShadow: '0 4px 16px 0 rgba(0,0,0,0.10), 0 1.5px 0 0 #fff inset', WebkitBackdropFilter: 'blur(8px)', background: 'linear-gradient(120deg, #f8fafc 60%, #e0f2fe 100%)' }}
          >
            <Icon className="h-6 w-6" />
            <span>{cat}</span>
          </Link>
        );
      })}
      <Link
        key="Jewellery"
        to="/jewellery"
        className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/90 shadow-lg font-semibold text-blue-700 hover:bg-blue-100 transition-all border border-blue-100 backdrop-blur-md"
        style={{ fontFamily: 'Poppins, Montserrat, Arial, sans-serif', fontSize: '1rem', boxShadow: '0 4px 16px 0 rgba(0,0,0,0.10), 0 1.5px 0 0 #fff inset', WebkitBackdropFilter: 'blur(8px)', background: 'linear-gradient(120deg, #f8fafc 60%, #e0f2fe 100%)' }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><polygon points="12,2 22,9 12,22 2,9" fill="#38bdf8" stroke="#0ea5e9" strokeWidth="2"/><polygon points="12,2 17,9 12,22 7,9" fill="#fff" fillOpacity=".7"/></svg>
        <span>Jewellery</span>
      </Link>
    </div>
  );
}; 