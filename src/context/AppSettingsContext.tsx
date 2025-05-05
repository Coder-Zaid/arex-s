
import React, { createContext, useContext, useState, useEffect } from 'react';

type CurrencyType = 'USD' | 'SAR';
type LanguageType = 'en' | 'ar';

interface AppSettingsContextType {
  currency: CurrencyType;
  language: LanguageType;
  setCurrency: (currency: CurrencyType) => void;
  setLanguage: (language: LanguageType) => void;
  currencySymbol: string;
  isRtl: boolean;
  translations: Record<string, Record<string, string>>;
  detectUserLocation: () => void;
}

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

export const currencySymbols = {
  USD: '$',
  SAR: 'ر.س'
};

// Add translations for Arabic and English
export const translations = {
  en: {
    home: "Home",
    search: "Search",
    wishlist: "Wishlist",
    cart: "Cart",
    profile: "Profile",
    about: "About",
    featuredProducts: "Featured Products",
    newArrivals: "New Arrivals",
    flashDeals: "Flash Deals",
    browseCategories: "Browse Categories",
    viewAll: "View all",
    addToCart: "Add to Cart",
    cashOnDelivery: "Cash on Delivery",
    cardPayment: "Credit/Debit Card",
    placeOrder: "Place Order",
    searchProducts: "Search products...",
    results: "results",
    noProductsFound: "No products found",
    clearSearch: "Clear search",
    seller: "Seller",
    orders: "Orders",
    support: "Support",
  },
  ar: {
    home: "الرئيسية",
    search: "بحث",
    wishlist: "المفضلة",
    cart: "السلة",
    profile: "الحساب",
    about: "عن الشركة",
    featuredProducts: "المنتجات المميزة",
    newArrivals: "وصل حديثا",
    flashDeals: "عروض سريعة",
    browseCategories: "تصفح الفئات",
    viewAll: "عرض الكل",
    addToCart: "أضف إلى السلة",
    cashOnDelivery: "الدفع عند الاستلام",
    cardPayment: "بطاقة ائتمان/خصم",
    placeOrder: "إتمام الطلب",
    searchProducts: "البحث عن المنتجات...",
    results: "نتائج",
    noProductsFound: "لا توجد منتجات",
    clearSearch: "مسح البحث",
    seller: "البائع",
    orders: "الطلبات",
    support: "الدعم",
  }
};

export const AppSettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrency] = useState<CurrencyType>('USD');
  const [language, setLanguage] = useState<LanguageType>('en');

  useEffect(() => {
    // Load saved settings from localStorage if available
    const savedCurrency = localStorage.getItem('currency') as CurrencyType;
    const savedLanguage = localStorage.getItem('language') as LanguageType;
    
    if (savedCurrency && (savedCurrency === 'USD' || savedCurrency === 'SAR')) {
      setCurrency(savedCurrency);
    } else {
      // Use default currency if not found in localStorage
      detectUserLocation();
    }
    
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'ar')) {
      setLanguage(savedLanguage);
      document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = savedLanguage;
    }
  }, []);

  const detectUserLocation = () => {
    // This is a simple implementation that could be expanded with actual geolocation
    try {
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      console.log('Detected timezone:', userTimeZone);
      
      // Very basic region detection - could be expanded with a proper geolocation service
      if (userTimeZone.includes('Asia/Riyadh') || 
          userTimeZone.includes('Asia/Dubai') || 
          userTimeZone.includes('Asia/Qatar')) {
        handleSetCurrency('SAR');
      } else {
        handleSetCurrency('USD');
      }
    } catch (error) {
      console.error('Error detecting location:', error);
      // Default to USD if detection fails
      handleSetCurrency('USD');
    }
  };

  const handleSetCurrency = (newCurrency: CurrencyType) => {
    setCurrency(newCurrency);
    localStorage.setItem('currency', newCurrency);
  };

  const handleSetLanguage = (newLanguage: LanguageType) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
    
    // Set RTL direction for Arabic
    document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLanguage;
  };

  const isRtl = language === 'ar';

  return (
    <AppSettingsContext.Provider 
      value={{ 
        currency, 
        language, 
        setCurrency: handleSetCurrency, 
        setLanguage: handleSetLanguage,
        currencySymbol: currencySymbols[currency],
        isRtl,
        translations,
        detectUserLocation
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
