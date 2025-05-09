import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { AppSettingsProvider } from "@/context/AppSettingsContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { OrderProvider } from "@/context/OrderContext";
import { ProductProvider } from '@/context/ProductContext';
import Layout from "@/components/Layout";
import SplashScreen from './components/SplashScreen';

// Pages
import HomePage from "@/pages/HomePage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CartPage from "@/pages/CartPage";
import WishlistPage from "@/pages/WishlistPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ProfilePage from "@/pages/ProfilePage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderConfirmationPage from "@/pages/OrderConfirmationPage";
import OrderDetailsPage from "@/pages/OrderDetailsPage";
import OrdersPage from "@/pages/OrdersPage";
import SearchPage from "@/pages/SearchPage";
import AboutPage from "@/pages/AboutPage";
import SellerDashboard from "@/pages/SellerDashboard";
import SellerPage from "@/pages/SellerPage";
import NotFound from "@/pages/NotFound";
import HistoryPage from '@/pages/HistoryPage';
import EditProfilePage from '@/pages/EditProfilePage';
import PersonalInfoPage from '@/pages/PersonalInfoPage';
import PaymentMethodsPage from '@/pages/PaymentMethodsPage';
import ShippingAddressesPage from '@/pages/ShippingAddressesPage';
import SettingsPage from '@/pages/SettingsPage';
import AddProductsPage from '@/pages/AddProductsPage';
import SellerProductsPage from '@/pages/SellerProductsPage';

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AppSettingsProvider>
            <TooltipProvider>
              <AuthProvider>
                <ProductProvider>
                  <CartProvider>
                    <WishlistProvider>
                      <OrderProvider>
                        <Layout>
                          <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/product/:id" element={<ProductDetailPage />} />
                            <Route path="/cart" element={<CartPage />} />
                            <Route path="/wishlist" element={<WishlistPage />} />
                            <Route path="/search" element={<SearchPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/profile/edit" element={<EditProfilePage />} />
                            <Route path="/history" element={<HistoryPage />} />
                            <Route path="/personal-info" element={<PersonalInfoPage />} />
                            <Route path="/payment-methods" element={<PaymentMethodsPage />} />
                            <Route path="/shipping-addresses" element={<ShippingAddressesPage />} />
                            <Route path="/settings" element={<SettingsPage />} />
                            <Route path="/checkout" element={<CheckoutPage />} />
                            <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
                            <Route path="/order/:id" element={<OrderDetailsPage />} />
                            <Route path="/orders" element={<OrdersPage />} />
                            <Route path="/seller" element={<SellerPage />} />
                            <Route path="/seller-dashboard" element={<SellerDashboard />} />
                            <Route path="/about" element={<AboutPage />} />
                            <Route path="/addproducts" element={<AddProductsPage />} />
                            <Route path="/seller-products" element={<SellerProductsPage />} />
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </Layout>
                        <Toaster />
                        <Sonner />
                      </OrderProvider>
                    </WishlistProvider>
                  </CartProvider>
                </ProductProvider>
              </AuthProvider>
            </TooltipProvider>
          </AppSettingsProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
