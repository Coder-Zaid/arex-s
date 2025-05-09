import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import BottomNavigation from './BottomNavigation';
import { Toaster } from '@/components/ui/toaster';
import { useTheme } from '@/context/ThemeContext';
import { useAppSettings } from '@/context/AppSettingsContext';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { theme } = useTheme();
  const { isRtl } = useAppSettings();
  const location = useLocation();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`mobile-container ${theme} transition-colors duration-300 bg-transparent relative h-screen`} 
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{ 
        color: theme === 'dark' ? '#ffffff' : '',
        backgroundColor: 'transparent',
      }}
    >
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-20">
        <Header />
      </div>
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="absolute left-0 right-0 top-[64px] bottom-[56px] overflow-y-auto"
        style={{height: 'calc(100vh - 64px - 56px)'}}
      >
        {children}
      </motion.main>
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t-0 bg-white/10 backdrop-blur-md shadow-lg rounded-t-xl flex justify-around items-center h-16">
        <BottomNavigation />
      </div>
      <Toaster />
    </motion.div>
  );
};

export default Layout;
