import { Home, ShoppingCart, User, Search, Settings, Sun, Moon, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';

export const Sidebar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="h-screen flex flex-col">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-primary">Gadget Haven</h1>
      </div>
      <div className="px-4 py-2 flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        {/* Theme toggle button */}
        <button
          onClick={toggleTheme}
          className={`w-10 h-10 rounded-full flex items-center justify-center border border-gray-300 shadow transition bg-white/70 dark:bg-black/40 ${theme === 'dark' ? 'text-white' : 'text-gray-700'} hover:bg-white/90 dark:hover:bg-black/60`}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>
      <nav className="mt-6 flex-1 flex flex-col gap-1">
        <Link to="/" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-primary">
          <Home className="h-5 w-5 mr-3" />
          <span>Home</span>
        </Link>
        <Link to="/orders" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-primary">
          <List className="h-5 w-5 mr-3" />
          <span>Orders</span>
        </Link>
        <Link to="/cart" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-primary">
          <ShoppingCart className="h-5 w-5 mr-3" />
          <span>Cart</span>
        </Link>
        <Link to="/profile" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-primary">
          <User className="h-5 w-5 mr-3" />
          <span>Profile</span>
        </Link>
        <Link to="/settings" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-primary">
          <Settings className="h-5 w-5 mr-3" />
          <span>Settings</span>
        </Link>
        <Link to="/jewellery" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-primary">
          <span className="h-5 w-5 mr-3">💍</span>
          <span>Jewellery</span>
        </Link>
      </nav>
    </div>
  );
}; 