import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { User, ShoppingCart, Heart, Search, ChevronLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ThemeToggle from './ThemeToggle';
import SettingsMenu from './SettingsMenu';
import { useTheme } from '@/context/ThemeContext';

const Header = () => {
  const { isAuthenticated, user } = useAuth();
  const { getTotalItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const showBack = location.pathname !== '/';
  
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="sticky top-0 z-10 bg-background border-b border-border shadow-sm"
    >
      <div className="container px-4 py-3 mx-auto">
        <div className="flex justify-between items-center">
          {/* Back Button */}
          {showBack && (
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mr-2">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
          
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={showBack ? 'flex-1' : ''}
          >
            <Link to="/" className="flex items-center">
              <img 
                src="/arex-bag.png" 
                alt="Arex Logo" 
                className="h-20 w-20 mr-4" 
              />
              <span
                className={`font-bold text-3xl px-4 py-1 rounded hidden sm:inline-block ${theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'}`}
                style={{letterSpacing: 2}}
              >AREX</span>
              <span
                className={`font-bold text-3xl px-4 py-1 rounded inline-block sm:hidden ${theme === 'dark' ? 'bg-white text-black' : 'bg-black text-white'}`}
                style={{letterSpacing: 2}}
              >AREX</span>
            </Link>
          </motion.div>
          
          {/* Search Bar (Mobile Hidden) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden md:flex w-full max-w-[120px] mx-4"
          >
            <div className="relative w-full max-w-xs mx-auto hidden md:block bg-transparent">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                type="search" 
                placeholder="Search..." 
                className="w-full pl-8 pr-3 py-2 rounded-md bg-white/10 backdrop-blur-md shadow text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
            </div>
          </motion.div>
          
          {/* Navigation Icons */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center space-x-4"
          >
            <ThemeToggle />
            <SettingsMenu />
            
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link to="/wishlist" className="relative">
                <Heart size={20} />
                <AnimatePresence>
                  {wishlistItems.length > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 bg-brand-orange text-white rounded-full text-xs w-4 h-4 flex items-center justify-center"
                    >
                      {wishlistItems.length}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link to="/cart" className="relative">
                <ShoppingCart size={20} />
                <AnimatePresence>
                  {getTotalItems() > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 bg-brand-orange text-white rounded-full text-xs w-4 h-4 flex items-center justify-center"
                    >
                      {getTotalItems()}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link to={isAuthenticated ? "/profile" : "/login"}>
                <User size={20} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
