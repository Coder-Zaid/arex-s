
import React, { createContext, useState, useContext, useEffect } from 'react';

// Define translation type
interface Translations {
  [key: string]: {
    home: string;
    search: string;
    wishlist: string;
    cart: string;
    orders: string;
    seller: string;
    profile: string;
    settings: string;
    language: string;
    theme: string;
    about: string;
    logout: string;
    login: string;
    register: string;
    addToCart: string;
    addToWishlist: string;
    removeFromWishlist: string;
    checkout: string;
    orderConfirmation: string;
    orderDetails: string;
    orderHistory: string;
    emptyCart: string;
    emptyWishlist: string;
    emptyOrders: string;
    productDetails: string;
    relatedProducts: string;
    reviews: string;
    specifications: string;
  };
}

interface AppSettingsContextType {
  language: string;
  setLanguage: (language: string) => void;
  currency: string;
  setCurrency: (currency: string) => void;
  currencySymbol: string;
  translations: Translations;
}

const translations: Translations = {
  en: {
    home: 'Home',
    search: 'Search',
    wishlist: 'Wishlist',
    cart: 'Cart',
    orders: 'Orders',
    seller: 'Seller',
    profile: 'Profile',
    settings: 'Settings',
    language: 'Language',
    theme: 'Theme',
    about: 'About',
    logout: 'Logout',
    login: 'Login',
    register: 'Register',
    addToCart: 'Add to Cart',
    addToWishlist: 'Add to Wishlist',
    removeFromWishlist: 'Remove from Wishlist',
    checkout: 'Checkout',
    orderConfirmation: 'Order Confirmation',
    orderDetails: 'Order Details',
    orderHistory: 'Order History',
    emptyCart: 'Your cart is empty',
    emptyWishlist: 'Your wishlist is empty',
    emptyOrders: 'No orders have been placed yet',
    productDetails: 'Product Details',
    relatedProducts: 'Related Products',
    reviews: 'Reviews',
    specifications: 'Specifications'
  },
  ar: {
    home: 'الرئيسية',
    search: 'بحث',
    wishlist: 'المفضلة',
    cart: 'السلة',
    orders: 'الطلبات',
    seller: 'البائع',
    profile: 'الملف الشخصي',
    settings: 'الإعدادات',
    language: 'اللغة',
    theme: 'المظهر',
    about: 'حول',
    logout: 'تسجيل الخروج',
    login: 'تسجيل الدخول',
    register: 'تسجيل',
    addToCart: 'أضف إلى السلة',
    addToWishlist: 'أضف إلى المفضلة',
    removeFromWishlist: 'إزالة من المفضلة',
    checkout: 'الدفع',
    orderConfirmation: 'تأكيد الطلب',
    orderDetails: 'تفاصيل الطلب',
    orderHistory: 'سجل الطلبات',
    emptyCart: 'سلة التسوق فارغة',
    emptyWishlist: 'قائمة المفضلة فارغة',
    emptyOrders: 'لم يتم تقديم أي طلبات بعد',
    productDetails: 'تفاصيل المنتج',
    relatedProducts: 'منتجات ذات صلة',
    reviews: 'التقييمات',
    specifications: 'المواصفات'
  }
};

const currencySymbols = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  SAR: 'ر.س',
};

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

export const useAppSettings = () => {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error('useAppSettings must be used within an AppSettingsProvider');
  }
  return context;
};

export const AppSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<string>('en');
  const [currency, setCurrency] = useState<string>('USD');
  const currencySymbol = currencySymbols[currency as keyof typeof currencySymbols] || '$';
  
  useEffect(() => {
    // Load settings from localStorage
    const storedLanguage = localStorage.getItem('language');
    const storedCurrency = localStorage.getItem('currency');
    
    if (storedLanguage) {
      setLanguage(storedLanguage);
    }
    
    if (storedCurrency) {
      setCurrency(storedCurrency);
    }
  }, []);
  
  useEffect(() => {
    // Save settings to localStorage when they change
    localStorage.setItem('language', language);
    localStorage.setItem('currency', currency);
  }, [language, currency]);
  
  return (
    <AppSettingsContext.Provider 
      value={{ 
        language, 
        setLanguage, 
        currency, 
        setCurrency,
        currencySymbol,
        translations
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
};
