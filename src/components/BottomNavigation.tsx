
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Heart, ShoppingCart, User, Package } from 'lucide-react';
import { useAppSettings } from '@/context/AppSettingsContext';
import { useAuth } from '@/context/AuthContext';

const BottomNavigation = () => {
  const { language, translations } = useAppSettings();
  const t = translations[language];
  const { user } = useAuth();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-background border-t z-50">
      <div className="flex justify-between">
        <NavLink 
          to="/home" 
          className={({ isActive }) => 
            `flex-1 flex flex-col items-center justify-center py-2 ${
              isActive ? 'text-primary' : 'text-muted-foreground'
            }`
          }
        >
          <Home className="h-5 w-5 mb-1" />
          <span className="text-xs">{t.home}</span>
        </NavLink>
        
        <NavLink 
          to="/search" 
          className={({ isActive }) => 
            `flex-1 flex flex-col items-center justify-center py-2 ${
              isActive ? 'text-primary' : 'text-muted-foreground'
            }`
          }
        >
          <Search className="h-5 w-5 mb-1" />
          <span className="text-xs">{t.search}</span>
        </NavLink>
        
        <NavLink 
          to="/wishlist" 
          className={({ isActive }) => 
            `flex-1 flex flex-col items-center justify-center py-2 ${
              isActive ? 'text-primary' : 'text-muted-foreground'
            }`
          }
        >
          <Heart className="h-5 w-5 mb-1" />
          <span className="text-xs">{t.wishlist}</span>
        </NavLink>
        
        <NavLink 
          to="/cart" 
          className={({ isActive }) => 
            `flex-1 flex flex-col items-center justify-center py-2 ${
              isActive ? 'text-primary' : 'text-muted-foreground'
            }`
          }
        >
          <ShoppingCart className="h-5 w-5 mb-1" />
          <span className="text-xs">{t.cart}</span>
        </NavLink>
        
        {user?.isSeller ? (
          <NavLink 
            to="/seller/dashboard" 
            className={({ isActive }) => 
              `flex-1 flex flex-col items-center justify-center py-2 ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`
            }
          >
            <Package className="h-5 w-5 mb-1" />
            <span className="text-xs">{t.seller}</span>
          </NavLink>
        ) : (
          <NavLink 
            to="/profile" 
            className={({ isActive }) => 
              `flex-1 flex flex-col items-center justify-center py-2 ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`
            }
          >
            <User className="h-5 w-5 mb-1" />
            <span className="text-xs">{t.profile}</span>
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default BottomNavigation;
