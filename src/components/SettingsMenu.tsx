
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
import { Settings } from 'lucide-react';
import { useAppSettings, currencySymbols } from '@/context/AppSettingsContext';
import { useToast } from '@/components/ui/use-toast';

const SettingsMenu = () => {
  const { currency, language, setCurrency, setLanguage } = useAppSettings();
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Settings size={18} />
          <span className="sr-only">Settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel className="text-xs pt-2">Currency</DropdownMenuLabel>
        <DropdownMenuItem 
          onClick={() => handleCurrencyChange('USD')}
          className={currency === 'USD' ? 'bg-muted' : ''}
        >
          {currencySymbols.USD} US Dollar (USD)
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleCurrencyChange('SAR')}
          className={currency === 'SAR' ? 'bg-muted' : ''}
        >
          {currencySymbols.SAR} Saudi Riyal (SAR)
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel className="text-xs pt-2">Language</DropdownMenuLabel>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('en')}
          className={language === 'en' ? 'bg-muted' : ''}
        >
          🇺🇸 English
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('ar')}
          className={language === 'ar' ? 'bg-muted' : ''}
        >
          🇸🇦 العربية
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SettingsMenu;
