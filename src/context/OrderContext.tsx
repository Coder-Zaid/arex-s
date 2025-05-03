
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Order, CartItem } from '../types';
import { useToast } from '@/components/ui/use-toast';
import { useCart } from './CartContext';

interface OrderContextType {
  orders: Order[];
  createOrder: (items: CartItem[], address: string, paymentMethod: 'cash' | 'card') => void;
  getOrderById: (orderId: string) => Order | undefined;
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
      status: 'pending',
      paymentMethod,
      deliveryAddress: address,
      orderDate: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
    
    setOrders(prevOrders => [...prevOrders, newOrder]);
    clearCart();
    
    toast({
      title: "Order placed successfully",
      description: `Order #${newOrder.id.substr(-6)} has been placed`,
    });
    
    return newOrder;
  };

  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };

  return (
    <OrderContext.Provider 
      value={{ 
        orders, 
        createOrder, 
        getOrderById
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};
