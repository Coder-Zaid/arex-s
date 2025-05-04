
import React from 'react';
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
