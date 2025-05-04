
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, ShoppingCart, User, Info } from 'lucide-react';
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
    <div className={`fixed bottom-0 left-0 right-0 ${theme === 'dark' ? 'bg-black border-gray-800' : 'bg-white border-gray-200'} border-t py-2 px-1 z-10 max-w-[480px] mx-auto`}>
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
          to="/profile"
          icon={<User size={20} />}
          label={t.profile}
          active={isActive('/profile')}
        />
        <NavItem 
          to="/about"
          icon={<Info size={20} />}
          label={language === 'ar' ? 'عن الشركة' : 'About'}
          active={isActive('/about')}
        />
      </div>
    </div>
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
    <Link 
      to={to} 
      className={cn(
        "flex flex-col items-center space-y-1 px-1", 
        active ? "text-brand-blue" : theme === 'dark' ? "text-gray-400" : "text-gray-500"
      )}
    >
      {icon}
      <span className="text-xs">{label}</span>
    </Link>
  );
};

export default BottomNavigation;
