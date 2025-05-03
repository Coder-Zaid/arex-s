
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, ShoppingCart, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

const BottomNavigation = () => {
  const location = useLocation();
  const { theme } = useTheme();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className={`fixed bottom-0 left-0 right-0 ${theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-t py-2 px-4 z-10`}>
      <div className="flex justify-around items-center">
        <NavItem 
          to="/"
          icon={<Home size={20} />}
          label="Home"
          active={isActive('/')}
        />
        <NavItem 
          to="/search"
          icon={<Search size={20} />}
          label="Search"
          active={isActive('/search')}
        />
        <NavItem 
          to="/wishlist"
          icon={<Heart size={20} />}
          label="Wishlist"
          active={isActive('/wishlist')}
        />
        <NavItem 
          to="/cart"
          icon={<ShoppingCart size={20} />}
          label="Cart"
          active={isActive('/cart')}
        />
        <NavItem 
          to="/profile"
          icon={<User size={20} />}
          label="Profile"
          active={isActive('/profile')}
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
        "flex flex-col items-center space-y-1", 
        active ? "text-brand-blue" : theme === 'dark' ? "text-gray-400" : "text-gray-500"
      )}
    >
      {icon}
      <span className="text-xs">{label}</span>
    </Link>
  );
};

export default BottomNavigation;
