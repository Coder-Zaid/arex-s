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
    <header className="w-full bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 dark:from-[#0a2240] dark:via-[#1e3a5c] dark:to-[#274472] px-4 py-2 flex items-center justify-between shadow-md">
      {/* Left: Hamburger, Logo and Location */}
      <div className="flex items-center gap-4">
        {showBack && (
          <button onClick={() => navigate(-1)} className="text-black dark:text-white hover:text-gray-700 dark:hover:text-white p-2 rounded transition">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-left"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          </button>
        )}
        <button onClick={() => setDrawerOpen(true)} className="text-black dark:text-white hover:text-gray-700 dark:hover:text-white p-2 rounded transition">
          <Menu className="h-7 w-7" />
        </button>
        <img src="/arex-bag.png" alt="AREX Logo" className="h-8 w-8 mr-2" />
        <span className="text-2xl font-bold text-black dark:text-white">AREX</span>
        <div className="flex items-center gap-1 text-black dark:text-white text-sm px-2 py-1 rounded transition">
          <Globe className="h-4 w-4" />
          <span>Deliver to</span>
          <select
            value={selectedCity}
            onChange={e => setSelectedCity(e.target.value)}
            className="font-semibold bg-white text-black rounded px-2 py-1 outline-none border border-gray-300 focus:ring-2 focus:ring-blue-200 appearance-none cursor-pointer shadow-sm"
            style={{ minWidth: 120 }}
          >
            <option disabled>Your City</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>
      {/* Center: Search Bar */}
      <div className="flex-1 max-w-xl mx-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="What are you looking for?"
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-200 shadow"
          />
        </div>
      </div>
      {/* Right: Language, Theme, User, Cart */}
      <div className="flex items-center gap-3">
        <button className="text-black dark:text-white hover:text-gray-700 dark:hover:text-white px-2 py-1 rounded transition">EN</button>
        <button onClick={toggleTheme} className="text-black dark:text-white hover:text-gray-700 dark:hover:text-white p-2 rounded-full transition">
          {theme === 'light' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        <Link to="/profile" className="text-black dark:text-white hover:text-gray-700 dark:hover:text-white p-2 rounded-full transition">
          <User className="h-5 w-5" />
        </Link>
        <Link to="/cart" className="text-black dark:text-white hover:text-gray-700 dark:hover:text-white p-2 rounded-full transition">
          <ShoppingCart className="h-5 w-5" />
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
    </header>
  );
}; 