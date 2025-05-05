
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { ShoppingCart, Heart, Search, Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ThemeToggle from './ThemeToggle';
import SettingsMenu from './SettingsMenu';

const Header = () => {
  const { isAuthenticated, user } = useAuth();
  const { getTotalItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const navigate = useNavigate();
  
  // Handle cart notification click
  const handleCartClick = () => {
    navigate('/cart');
  };
  
  return (
    <header className="sticky top-0 z-10 bg-background border-b border-border shadow-sm">
      <div className="container px-4 py-3 mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/73e6fac1-59a6-46dd-8d53-a8eed9d28374.png" 
              alt="Riyal Logo" 
              className="h-10 w-10 mr-2 dark:invert" 
            />
            <span className="font-bold text-xl text-brand-blue hidden sm:inline-block">Arex</span>
            <span className="font-bold text-xl text-brand-blue inline-block sm:hidden">Arex</span>
          </Link>
          
          {/* Search Bar (Mobile Hidden) */}
          <div className="hidden md:flex w-full max-w-[120px] mx-4">
            <div className="relative w-full">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                type="search" 
                placeholder="Search..." 
                className="pl-8 w-full h-8 text-sm"
              />
            </div>
          </div>
          
          {/* Navigation Icons */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <SettingsMenu />
            
            <Link to="/wishlist" className="relative">
              <Heart size={20} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-orange text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            
            <div className="relative cursor-pointer" onClick={handleCartClick}>
              <ShoppingCart size={20} />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-orange text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </div>
            
            <Link to={isAuthenticated ? "/orders" : "/login"}>
              <Package size={20} />
            </Link>
          </div>
        </div>
      </div>
      
      {/* Mobile Search Bar */}
      <div className="md:hidden bg-gray-50 dark:bg-gray-800 px-4 py-2">
        <div className="relative w-full">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            type="search" 
            placeholder="Search..." 
            className="pl-8 w-full h-8 text-sm"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
