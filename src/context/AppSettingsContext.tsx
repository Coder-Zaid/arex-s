
import React, { createContext, useContext, useState, useEffect } from 'react';

type CurrencyType = 'USD' | 'SAR';
type LanguageType = 'en' | 'ar';

interface AppSettingsContextType {
  currency: CurrencyType;
  language: LanguageType;
  setCurrency: (currency: CurrencyType) => void;
  setLanguage: (language: LanguageType) => void;
  currencySymbol: string;
}

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

export const currencySymbols = {
  USD: '$',
  SAR: 'ر.س'
};

export const AppSettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrency] = useState<CurrencyType>('USD');
  const [language, setLanguage] = useState<LanguageType>('en');

  useEffect(() => {
    // Load saved settings from localStorage if available
    const savedCurrency = localStorage.getItem('currency') as CurrencyType;
    const savedLanguage = localStorage.getItem('language') as LanguageType;
    
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
    
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetCurrency = (newCurrency: CurrencyType) => {
    setCurrency(newCurrency);
    localStorage.setItem('currency', newCurrency);
  };

  const handleSetLanguage = (newLanguage: LanguageType) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    // You might want to implement more language-related logic here
  };

  return (
    <AppSettingsContext.Provider 
      value={{ 
        currency, 
        language, 
        setCurrency: handleSetCurrency, 
        setLanguage: handleSetLanguage,
        currencySymbol: currencySymbols[currency]
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = () => {
  const context = useContext(AppSettingsContext);
  if (context === undefined) {
    throw new Error('useAppSettings must be used within an AppSettingsProvider');
  }
  return context;
};
