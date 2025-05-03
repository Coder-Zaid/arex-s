
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { User, ShoppingCart, Heart, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const Header = () => {
  const { isAuthenticated, user } = useAuth();
  const { getTotalItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  
  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm">
      <div className="container px-4 py-3 mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="font-bold text-xl text-brand-blue">
            GadgetHaven
          </Link>
          
          {/* Search Bar (Mobile Hidden) */}
          <div className="hidden md:flex w-full max-w-xs mx-4">
            <div className="relative w-full">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                type="search" 
                placeholder="Search products..." 
                className="pl-8 w-full"
              />
            </div>
          </div>
          
          {/* Navigation Icons */}
          <div className="flex items-center space-x-4">
            <Link to="/wishlist" className="relative">
              <Heart size={20} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-orange text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
            
            <Link to="/cart" className="relative">
              <ShoppingCart size={20} />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-orange text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </Link>
            
            <Link to={isAuthenticated ? "/profile" : "/login"}>
              <User size={20} />
            </Link>
          </div>
        </div>
      </div>
      
      {/* Mobile Search Bar */}
      <div className="md:hidden bg-gray-50 px-4 py-2">
        <div className="relative w-full">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            type="search" 
            placeholder="Search products..." 
            className="pl-8 w-full"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
