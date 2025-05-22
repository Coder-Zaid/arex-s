import { ReactNode } from 'react';
import { useDeviceType } from '@/hooks/useDeviceType';
import { BottomNavigation } from '@/components/navigation/BottomNavigation';

interface ResponsiveLayoutProps {
  children: ReactNode;
}

export const ResponsiveLayout = ({ children }: ResponsiveLayoutProps) => {
  const { isMobile } = useDeviceType();
  const bgClass = 'bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 dark:from-[#1B263B] dark:via-[#232946] dark:to-[#2E3A59]';

  return (
    <div className={`min-h-screen ${bgClass} ${isMobile ? 'mobile-layout' : 'desktop-layout'}`}>
      {isMobile ? (
        // Mobile layout - full width, bottom navigation
        <div className="flex flex-col h-screen">
          <main className="flex-1 overflow-y-auto pb-16">
            {children}
          </main>
          <BottomNavigation />
        </div>
      ) : (
        // Desktop layout - no sidebar
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      )}
    </div>
  );
}; 