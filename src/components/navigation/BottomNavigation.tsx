import { Home, ShoppingCart, User, Menu, Gem } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BottomNavigation = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around items-center h-16">
        <Link to="/" className="flex flex-col items-center text-gray-600 hover:text-primary">
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link to="/categories" className="flex flex-col items-center text-gray-600 hover:text-primary">
          <Menu className="h-6 w-6" />
          <span className="text-xs mt-1">Categories</span>
        </Link>
        <Link to="/cart" className="flex flex-col items-center text-gray-600 hover:text-primary">
          <ShoppingCart className="h-6 w-6" />
          <span className="text-xs mt-1">Cart</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center text-gray-600 hover:text-primary">
          <User className="h-6 w-6" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
        <Link to="/jewellery" className="flex flex-col items-center text-gray-600 hover:text-primary">
          <Gem size={20} />
          <span className="text-xs mt-1">Jewellery</span>
        </Link>
      </div>
    </nav>
  );
}; 