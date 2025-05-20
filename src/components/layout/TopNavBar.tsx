import { Search, ShoppingCart, User, Globe, Sun, Moon, Menu, Home as HomeIcon, List, Settings } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export const TopNavBar = () => {
  const { theme, toggleTheme } = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Your City');
  const cities = ['Ar - Dammam', 'Khobar', 'Dhahran', 'Al Thuqbah', 'Saihai'];
  const location = useLocation();
  const navigate = useNavigate();
  const showBack = location.pathname !== '/';

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
  };

  return (
    <nav className="sticky top-0 z-20 w-full h-16 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 dark:from-[#0a2240] dark:via-[#1e3a5c] dark:to-[#274472] flex items-center justify-between px-4 shadow-md">
      {/* Left: Logo and App Name */}
      <div className="flex items-center gap-3">
        <img src="/arex-bag.png" alt="AREX Logo" className="h-8 w-8" />
        <span className="text-2xl font-bold text-white">AREX</span>
      </div>
      {/* Right: Action Icons */}
      <div className="flex items-center gap-5">
        <button onClick={toggleTheme} className="text-white hover:text-blue-200 p-2 rounded-full transition">
          {theme === 'light' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
        </button>
        <Link to="/settings" className="text-white hover:text-blue-200 p-2 rounded-full transition">
          <Settings className="h-6 w-6" />
        </Link>
        <Link to="/cart" className="text-white hover:text-blue-200 p-2 rounded-full transition">
          <ShoppingCart className="h-6 w-6" />
        </Link>
        <Link to="/profile" className="text-white hover:text-blue-200 p-2 rounded-full transition">
          <User className="h-6 w-6" />
        </Link>
      </div>
      {/* Drawer with sidebar content */}
      {drawerOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex">
          <div className="w-72 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 dark:from-[#0a2240] dark:via-[#1e3a5c] dark:to-[#274472] h-full shadow-lg p-6 flex flex-col">
            <button onClick={() => setDrawerOpen(false)} className="mb-6 text-black dark:text-white hover:text-gray-700 dark:hover:text-white self-end text-2xl">✕</button>
            <div className="flex items-center mb-6">
              <img src="/arex-bag.png" alt="AREX Logo" className="h-8 w-8 mr-2" />
              <span className="text-2xl font-bold text-black dark:text-white">AREX</span>
            </div>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-200 shadow"
                />
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className={`w-10 h-10 mb-6 rounded-full flex items-center justify-center border border-gray-300 shadow transition bg-white/70 dark:bg-black/40 text-black dark:text-white hover:bg-white/90 dark:hover:bg-black/60`}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <nav className="flex flex-col gap-4 mt-2">
              <Link to="/" className="flex items-center gap-3 text-black dark:text-white hover:text-gray-700 dark:hover:text-white text-lg">
                <HomeIcon className="h-5 w-5" /> Home
              </Link>
              <Link to="/orders" className="flex items-center gap-3 text-black dark:text-white hover:text-gray-700 dark:hover:text-white text-lg">
                <List className="h-5 w-5" /> Orders
              </Link>
              <Link to="/cart" className="flex items-center gap-3 text-black dark:text-white hover:text-gray-700 dark:hover:text-white text-lg">
                <ShoppingCart className="h-5 w-5" /> Cart
              </Link>
              <Link to="/profile" className="flex items-center gap-3 text-black dark:text-white hover:text-gray-700 dark:hover:text-white text-lg">
                <User className="h-5 w-5" /> Profile
              </Link>
              <Link to="/settings" className="flex items-center gap-3 text-black dark:text-white hover:text-gray-700 dark:hover:text-white text-lg">
                <Settings className="h-5 w-5" /> Settings
              </Link>
              <Link to="/jewellery" className="flex items-center gap-3 text-black dark:text-white hover:text-gray-700 dark:hover:text-white text-lg">
                <span className="h-5 w-5">💍</span> Jewellery
              </Link>
            </nav>
          </div>
          <div className="flex-1" onClick={() => setDrawerOpen(false)} />
        </div>
      )}
    </nav>
  );
}; 