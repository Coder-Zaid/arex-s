
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import BottomNavigation from './BottomNavigation';
import { Toaster } from '@/components/ui/toaster';
import { useTheme } from '@/context/ThemeContext';
import { useAppSettings } from '@/context/AppSettingsContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { theme } = useTheme();
  const { isRtl } = useAppSettings();
  const navigate = useNavigate();

  useEffect(() => {
    // Global click handler for toast notifications
    const handleToastClick = (e: MouseEvent) => {
      const toastElement = (e.target as HTMLElement).closest('.toast');
      if (toastElement) {
        // Navigate to cart
        navigate('/cart');
      }
    };

    document.addEventListener('click', handleToastClick);
    return () => {
      document.removeEventListener('click', handleToastClick);
    };
  }, [navigate]);

  return (
    <div 
      className={`mobile-container ${theme} transition-colors duration-300`} 
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{ 
        backgroundColor: theme === 'dark' ? '#000000' : '', 
        color: theme === 'dark' ? '#ffffff' : '' 
      }}
    >
      <Header />
      <main>
        {children}
      </main>
      <BottomNavigation />
      <Toaster />
    </div>
  );
};

export default Layout;
