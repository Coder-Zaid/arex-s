
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import HomePage from "@/pages/HomePage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderConfirmationPage from "@/pages/OrderConfirmationPage";
import OrdersPage from "@/pages/OrdersPage";
import OrderDetailsPage from "@/pages/OrderDetailsPage";
import WishlistPage from "@/pages/WishlistPage";
import SearchPage from "@/pages/SearchPage";
import ProfilePage from "@/pages/ProfilePage";
import AboutPage from "@/pages/AboutPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import Layout from "@/components/Layout";
import { ThemeProvider } from '@/context/ThemeContext';
import { AppSettingsProvider } from '@/context/AppSettingsContext';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { OrderProvider } from '@/context/OrderContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SellerDashboard from '@/pages/SellerDashboard';
import BecomeSellerPage from '@/pages/BecomeSellerPage';
import SellerProductManagement from '@/pages/SellerProductManagement';

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider>
      <AppSettingsProvider>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <OrderProvider>
                <QueryClientProvider client={queryClient}>
                  <RouterProvider router={router} />
                </QueryClientProvider>
              </OrderProvider>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </AppSettingsProvider>
    </ThemeProvider>
  );
}

const router = createBrowserRouter([
  {
    path: "",
    element: <Index />,
    errorElement: <NotFound />
  },
  {
    path: "home",
    element: <Layout><HomePage /></Layout>
  },
  {
    path: "product/:id",
    element: <Layout><ProductDetailPage /></Layout>
  },
  {
    path: "cart",
    element: <Layout><CartPage /></Layout>
  },
  {
    path: "checkout",
    element: <Layout><CheckoutPage /></Layout>
  },
  {
    path: "order-confirmation/:id",
    element: <Layout><OrderConfirmationPage /></Layout>
  },
  {
    path: "orders",
    element: <Layout><OrdersPage /></Layout>
  },
  {
    path: "order/:id",
    element: <Layout><OrderDetailsPage /></Layout>
  },
  {
    path: "wishlist",
    element: <Layout><WishlistPage /></Layout>
  },
  {
    path: "search",
    element: <Layout><SearchPage /></Layout>
  },
  {
    path: "profile",
    element: <Layout><ProfilePage /></Layout>
  },
  {
    path: "about",
    element: <Layout><AboutPage /></Layout>
  },
  {
    path: "login",
    element: <Layout><LoginPage /></Layout>
  },
  {
    path: "register",
    element: <Layout><RegisterPage /></Layout>
  },
  {
    path: "seller/dashboard",
    element: <Layout><SellerDashboard /></Layout>
  },
  {
    path: "become-seller",
    element: <Layout><BecomeSellerPage /></Layout>
  },
  {
    path: "seller/products",
    element: <Layout><SellerProductManagement /></Layout>
  },
]);

export default App;
