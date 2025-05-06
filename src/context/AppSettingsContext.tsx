
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
    noOrders: string;
    productDetails: string;
    relatedProducts: string;
    reviews: string;
    specifications: string;
    featuredProducts: string;
    newArrivals: string;
    flashDeals: string;
    viewAll: string;
    browseCategories: string;
    cashOnDelivery: string;
    cardPayment: string;
    placeOrder: string;
  };
}

// Export currency symbols so they can be imported elsewhere
export const currencySymbols: { [key: string]: string } = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  SAR: 'ر.س',
};

interface AppSettingsContextType {
  language: string;
  setLanguage: (language: string) => void;
  currency: string;
  setCurrency: (currency: string) => void;
  currencySymbol: string;
  currencySymbols: { [key: string]: string };
  translations: Translations;
  isRtl: boolean;
  detectUserLocation: () => void;
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
    noOrders: 'No orders have been placed yet',
    productDetails: 'Product Details',
    relatedProducts: 'Related Products',
    reviews: 'Reviews',
    specifications: 'Specifications',
    featuredProducts: 'Featured Products',
    newArrivals: 'New Arrivals',
    flashDeals: 'Flash Deals',
    viewAll: 'View All',
    browseCategories: 'Browse Categories',
    cashOnDelivery: 'Cash on Delivery',
    cardPayment: 'Card Payment',
    placeOrder: 'Place Order'
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
    noOrders: 'لم يتم تقديم أي طلبات بعد',
    productDetails: 'تفاصيل المنتج',
    relatedProducts: 'منتجات ذات صلة',
    reviews: 'التقييمات',
    specifications: 'المواصفات',
    featuredProducts: 'منتجات مميزة',
    newArrivals: 'وصل حديثاً',
    flashDeals: 'عروض سريعة',
    viewAll: 'عرض الكل',
    browseCategories: 'تصفح الفئات',
    cashOnDelivery: 'الدفع عند الاستلام',
    cardPayment: 'الدفع بالبطاقة',
    placeOrder: 'تأكيد الطلب'
  }
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
  const isRtl = language === 'ar';
  
  // Function to detect user location and set appropriate currency
  const detectUserLocation = () => {
    // In a real application, you would use geolocation API or IP-based detection
    // For now, let's simulate a location detection
    setTimeout(() => {
      const randomLocation = Math.random() > 0.5 ? 'US' : 'SA';
      if (randomLocation === 'SA') {
        setCurrency('SAR');
        setLanguage('ar');
      } else {
        setCurrency('USD');
        setLanguage('en');
      }
    }, 1000);
  };
  
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
        currencySymbols,
        translations,
        isRtl,
        detectUserLocation
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
};
