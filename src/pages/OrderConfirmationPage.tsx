
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useOrder } from '@/context/OrderContext';

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const { orders } = useOrder();
  
  // Redirect if there are no orders
  useEffect(() => {
    if (orders.length === 0) {
      navigate('/');
    }
  }, [orders, navigate]);
  
  if (orders.length === 0) return null;
  
  // Get the most recent order
  const latestOrder = orders[orders.length - 1];
  const orderId = latestOrder?.id.substr(-6);
  
  return (
    <div className="p-4 flex flex-col items-center justify-center min-h-[80vh]">
      <CheckCircle size={80} className="text-green-500 mb-4" />
      
      <h1 className="text-2xl font-bold text-center mb-2">Order Confirmed!</h1>
      <p className="text-gray-500 text-center mb-6">
        Thank you for your order. Your order has been received.
      </p>
      
      <div className="w-full max-w-sm bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-gray-500">Order ID:</span>
          <span className="font-medium">#{orderId}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-500">Date:</span>
          <span>{new Date(latestOrder.orderDate).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-500">Total:</span>
          <span className="font-medium">${latestOrder.totalAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Payment Method:</span>
          <span>{latestOrder.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Card'}</span>
        </div>
      </div>
      
      <div className="space-y-4 w-full max-w-sm">
        <Button 
          className="w-full bg-brand-blue hover:bg-brand-blue/90"
          onClick={() => navigate(`/order/${latestOrder.id}`)}
        >
          View Order Details
        </Button>
        
        <Button 
          variant="outline"
          className="w-full"
          onClick={() => navigate('/')}
        >
          Continue Shopping
        </Button>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
