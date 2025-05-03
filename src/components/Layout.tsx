
import React from 'react';
import Header from './Header';
import BottomNavigation from './BottomNavigation';
import { Toaster } from '@/components/ui/toaster';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="mobile-container bg-background">
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
