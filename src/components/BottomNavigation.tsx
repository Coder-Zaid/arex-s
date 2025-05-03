
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, ShoppingCart, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const BottomNavigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 z-10">
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

const NavItem = ({ to, icon, label, active }: NavItemProps) => (
  <Link 
    to={to} 
    className={cn(
      "flex flex-col items-center space-y-1", 
      active ? "text-brand-blue" : "text-gray-500"
    )}
  >
    {icon}
    <span className="text-xs">{label}</span>
  </Link>
);

export default BottomNavigation;
