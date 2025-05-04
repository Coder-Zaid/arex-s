
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Order, CartItem } from '../types';
import { useToast } from '@/components/ui/use-toast';
import { useCart } from './CartContext';
import { useAppSettings } from './AppSettingsContext';

interface OrderContextType {
  orders: Order[];
  createOrder: (items: CartItem[], address: string, paymentMethod: 'cash' | 'card') => void;
  getOrderById: (orderId: string) => Order | undefined;
  cancelOrder: (orderId: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { toast } = useToast();
  const { clearCart } = useCart();
  const { currency, language } = useAppSettings();

  useEffect(() => {
    // Load orders from localStorage on initialization
    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
  }, []);

  useEffect(() => {
    // Save orders to localStorage whenever they change
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const createOrder = (items: CartItem[], address: string, paymentMethod: 'cash' | 'card') => {
    const totalAmount = items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    
    const newOrder: Order = {
      id: `order-${Date.now()}`,
      items,
      totalAmount,
      currency, // Store the current currency with the order
      status: 'pending',
      paymentMethod,
      deliveryAddress: address,
      orderDate: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
    
    setOrders(prevOrders => [...prevOrders, newOrder]);
    clearCart();
    
    toast({
      title: language === 'ar' ? "تم تقديم الطلب بنجاح" : "Order placed successfully",
      description: language === 'ar' 
        ? `الطلب رقم #${newOrder.id.substr(-6).replace(/\d/g, d => String.fromCharCode(1632 + parseInt(d)))} تم تقديمه` 
        : `Order #${newOrder.id.substr(-6)} has been placed`,
    });
    
    return newOrder;
  };

  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };

  const cancelOrder = (orderId: string) => {
    setOrders(prevOrders => {
      return prevOrders.map(order => {
        if (order.id === orderId) {
          return { ...order, status: 'cancelled' };
        }
        return order;
      });
    });

    toast({
      title: language === 'ar' ? "تم إلغاء الطلب" : "Order cancelled",
      description: language === 'ar'
        ? `تم إلغاء الطلب رقم #${orderId.substr(-6).replace(/\d/g, d => String.fromCharCode(1632 + parseInt(d)))}`
        : `Order #${orderId.substr(-6)} has been cancelled`,
    });
  };

  return (
    <OrderContext.Provider 
      value={{ 
        orders, 
        createOrder, 
        getOrderById,
        cancelOrder
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
