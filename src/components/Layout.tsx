
import React from 'react';
import Header from './Header';
import BottomNavigation from './BottomNavigation';
import { Toaster } from '@/components/ui/toaster';
import { useTheme } from '@/context/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { theme } = useTheme();

  return (
    <div className={`mobile-container bg-background ${theme}`}>
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
