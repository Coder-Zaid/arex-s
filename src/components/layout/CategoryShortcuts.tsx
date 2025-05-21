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
    <div className="flex gap-4 px-4 py-3 overflow-x-auto bg-transparent">
      {categories.map((cat, i) => {
        const Icon = icons[i] || Tag;
        return (
          <Link
            key={cat}
            to={`/search?category=${encodeURIComponent(cat.toLowerCase().replace(/\s+/g, '-'))}`}
            className="flex flex-col items-center justify-center w-16 h-16 rounded-full bg-white/80 shadow text-blue-600 hover:bg-blue-100 transition"
          >
            <Icon className="h-7 w-7 mb-1" />
            <span className="text-xs font-medium">{cat}</span>
          </Link>
        );
      })}
      <Link
        key="Jewellery"
        to="/jewellery"
        className="flex flex-col items-center justify-center w-16 h-16 rounded-full bg-white/80 shadow text-blue-600 hover:bg-blue-100 transition"
      >
        <span className="text-2xl mb-1" role="img" aria-label="jewel">💍</span>
        <span className="text-xs font-medium">Jewellery</span>
      </Link>
    </div>
  );
}; 