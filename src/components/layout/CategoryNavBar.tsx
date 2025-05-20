import { Link } from 'react-router-dom';
import { useProducts } from '@/context/ProductContext';

export const getUniqueCategories = (products) => {
  const set = new Set(products.map((p) => p.category));
  return Array.from(set);
};

export const CategoryNavBar = () => {
  const { products } = useProducts();
  const categories = getUniqueCategories(products);

  return (
    <nav className="w-full bg-white/80 shadow flex overflow-x-auto whitespace-nowrap px-2 py-1 border-b border-gray-200">
      {categories.map((cat) => (
        <Link
          key={cat}
          to={`/search?category=${encodeURIComponent(cat.toLowerCase().replace(/\s+/g, '-'))}`}
          className="mx-2 px-4 py-2 rounded-full font-medium text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition"
        >
          {cat}
        </Link>
      ))}
    </nav>
  );
}; 