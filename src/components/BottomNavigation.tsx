import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, Heart, ShoppingCart, Package, Store } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';
import { useAppSettings } from '@/context/AppSettingsContext';

const BottomNavigation = () => {
  const location = useLocation();
  const { theme } = useTheme();
  const { language, translations } = useAppSettings();
  const t = translations[language];
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="fixed bottom-0 left-0 right-0 border-t border-transparent py-2 px-1 z-10 max-w-[480px] mx-auto bg-transparent"
      style={{backdropFilter: 'none'}}
    >
      <div className="flex justify-around items-center">
        <NavItem 
          to="/"
          icon={<Home size={20} />}
          label={t.home}
          active={isActive('/')}
        />
        <NavItem 
          to="/search"
          icon={<Search size={20} />}
          label={t.search}
          active={isActive('/search')}
        />
        <NavItem 
          to="/wishlist"
          icon={<Heart size={20} />}
          label={t.wishlist}
          active={isActive('/wishlist')}
        />
        <NavItem 
          to="/cart"
          icon={<ShoppingCart size={20} />}
          label={t.cart}
          active={isActive('/cart')}
        />
        <NavItem 
          to="/orders"
          icon={<Package size={20} />}
          label={t.orders}
          active={isActive('/orders')}
        />
        <NavItem 
          to="/seller"
          icon={<Store size={20} />}
          label={t.seller}
          active={isActive('/seller')}
        />
      </div>
    </motion.div>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}

const NavItem = ({ to, icon, label, active }: NavItemProps) => {
  const { theme } = useTheme();
  
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <Link 
        to={to} 
        className={cn(
          "flex flex-col items-center space-y-1 px-1 text-black", 
          active 
            ? "font-bold" 
            : "opacity-70"
        )}
      >
        <motion.div
          animate={active ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          {icon}
        </motion.div>
        <motion.span 
          className="text-xs"
          animate={active ? { y: [-2, 0] } : {}}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.span>
      </Link>
    </motion.div>
  );
};

export default BottomNavigation;
