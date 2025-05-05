import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { Package, ShoppingBag, TruckIcon } from 'lucide-react';

const OrdersPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState([]); // Empty orders for demo

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  if (orders.length === 0) {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-[60vh]">
        <ShoppingBag size={64} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-bold mb-2">No orders placed yet</h2>
        <p className="text-gray-500 text-center mb-4 max-w-md">
          You haven't placed any orders yet. Browse our products and place your first order.
        </p>
        <Button onClick={() => navigate('/')}>Start Shopping</Button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto pb-24">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {/* Order cards would go here */}
        </TabsContent>
        
        <TabsContent value="processing">
          {/* Processing orders */}
        </TabsContent>
        
        <TabsContent value="shipped">
          {/* Shipped orders */}
        </TabsContent>
        
        <TabsContent value="delivered">
          {/* Delivered orders */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrdersPage;
