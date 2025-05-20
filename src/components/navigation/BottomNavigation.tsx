import { Home, ShoppingCart, User, Menu, Gem } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const BottomNavigation = () => {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/60 dark:bg-[#0a2240]/60 backdrop-blur border-t border-gray-200 dark:border-gray-700 shadow-lg flex justify-around items-center h-16">
      <div className="flex w-full h-16">
        <Link to="/" className="flex-1 flex flex-col items-center justify-center text-gray-600 hover:text-primary py-2">
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link to="/categories" className="flex-1 flex flex-col items-center justify-center text-gray-600 hover:text-primary py-2">
          <Menu className="h-6 w-6" />
          <span className="text-xs mt-1">Categories</span>
        </Link>
        <Link to="/cart" className="flex-1 flex flex-col items-center justify-center text-gray-600 hover:text-primary py-2">
          <ShoppingCart className="h-6 w-6" />
          <span className="text-xs mt-1">Cart</span>
        </Link>
        <Link to={isAuthenticated ? "/profile" : "/login"} className="flex-1 flex flex-col items-center justify-center text-gray-600 hover:text-primary py-2">
          <User className="h-6 w-6" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
        <Link to="/jewellery" className="flex-1 flex flex-col items-center justify-center text-gray-600 hover:text-primary py-2">
          <Gem size={20} />
          <span className="text-xs mt-1">Jewellery</span>
        </Link>
      </div>
    </nav>
  );
}; 