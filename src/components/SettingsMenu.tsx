
import React from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Settings, Globe, CreditCard } from 'lucide-react';
import { useAppSettings, currencySymbols } from '@/context/AppSettingsContext';
import { useToast } from '@/components/ui/use-toast';
import { useTheme } from '@/context/ThemeContext';

const SettingsMenu = () => {
  const { currency, language, setCurrency, setLanguage, detectUserLocation } = useAppSettings();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  const handleCurrencyChange = (newCurrency: 'USD' | 'SAR') => {
    setCurrency(newCurrency);
    toast({
      title: 'Currency Changed',
      description: `Currency set to ${newCurrency === 'USD' ? 'US Dollar' : 'Saudi Riyal'}`,
      duration: 2000
    });
  };

  const handleLanguageChange = (newLanguage: 'en' | 'ar') => {
    setLanguage(newLanguage);
    toast({
      title: 'Language Changed',
      description: `Language set to ${newLanguage === 'en' ? 'English' : 'Arabic'}`,
      duration: 2000
    });
  };

  const handleAutoDetect = () => {
    detectUserLocation();
    toast({
      title: 'Auto-detection',
      description: 'Detecting your location to set currency...',
      duration: 2000
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Settings size={18} />
          <span className="sr-only">Settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={theme === 'dark' ? 'bg-gray-900 border-gray-800' : ''}>
        <DropdownMenuLabel className={theme === 'dark' ? 'text-white' : ''}>Settings</DropdownMenuLabel>
        <DropdownMenuSeparator className={theme === 'dark' ? 'bg-gray-800' : ''} />
        
        <DropdownMenuLabel className={`text-xs pt-2 ${theme === 'dark' ? 'text-gray-400' : ''}`}>Currency</DropdownMenuLabel>
        <DropdownMenuItem 
          onClick={() => handleCurrencyChange('USD')}
          className={currency === 'USD' ? `${theme === 'dark' ? 'bg-[#191919] text-white' : 'bg-muted'}` : theme === 'dark' ? 'text-gray-300' : ''}
        >
          {currencySymbols.USD} US Dollar (USD)
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleCurrencyChange('SAR')}
          className={currency === 'SAR' ? `${theme === 'dark' ? 'bg-[#191919] text-white' : 'bg-muted'}` : theme === 'dark' ? 'text-gray-300' : ''}
        >
          {currencySymbols.SAR} Saudi Riyal (SAR)
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleAutoDetect}
          className={theme === 'dark' ? 'text-gray-300' : ''}
        >
          <Globe size={14} className="mr-2" />
          Auto-detect (Location)
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className={theme === 'dark' ? 'bg-gray-800' : ''} />
        
        <DropdownMenuLabel className={`text-xs pt-2 ${theme === 'dark' ? 'text-gray-400' : ''}`}>Language</DropdownMenuLabel>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('en')}
          className={language === 'en' ? `${theme === 'dark' ? 'bg-[#191919] text-white' : 'bg-muted'}` : theme === 'dark' ? 'text-gray-300' : ''}
        >
          🇺🇸 English
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('ar')}
          className={language === 'ar' ? `${theme === 'dark' ? 'bg-[#191919] text-white' : 'bg-muted'}` : theme === 'dark' ? 'text-gray-300' : ''}
        >
          🇸🇦 العربية
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className={theme === 'dark' ? 'bg-gray-800' : ''} />
        
        <DropdownMenuLabel className={`text-xs pt-2 ${theme === 'dark' ? 'text-gray-400' : ''}`}>Theme</DropdownMenuLabel>
        <DropdownMenuItem 
          onClick={toggleTheme}
          className={theme === 'dark' ? 'text-gray-300' : ''}
        >
          {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SettingsMenu;
