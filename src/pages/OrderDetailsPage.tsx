
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useOrder } from '@/context/OrderContext';
import { ChevronLeft, Package, Truck } from 'lucide-react';

const OrderDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getOrderById } = useOrder();
  
  const order = getOrderById(id || '');
  
  if (!order) {
    return (
      <div className="p-4 flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-xl font-bold mb-2">Order not found</h2>
        <p className="text-gray-500 mb-4">The order you're looking for doesn't exist</p>
        <Button onClick={() => navigate('/profile')}>Back to Profile</Button>
      </div>
    );
  }
  
  const orderDate = new Date(order.orderDate).toLocaleDateString();
  const estimatedDelivery = order.estimatedDelivery 
    ? new Date(order.estimatedDelivery).toLocaleDateString() 
    : 'Calculating...';
  
  return (
    <div className="pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm p-3 flex items-center">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft />
        </Button>
        <h1 className="font-medium text-center flex-1 mr-8">Order #{order.id.substr(-6)}</h1>
      </div>
      
      {/* Order Status */}
      <div className="p-4">
        <Card>
          <CardContent className="p-4">
            <h2 className="font-bold mb-2">Order Status</h2>
            
            <div className="flex items-center mb-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                order.status === 'pending' || order.status === 'processing' || 
                order.status === 'shipped' || order.status === 'delivered'
                ? 'bg-brand-blue text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                1
              </div>
              <div className="h-1 flex-1 mx-2 bg-gray-200">
                <div className={`h-full ${
                  order.status === 'processing' || 
                  order.status === 'shipped' || 
                  order.status === 'delivered'
                  ? 'bg-brand-blue' : 'bg-gray-200'
                }`}></div>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                order.status === 'processing' || 
                order.status === 'shipped' || 
                order.status === 'delivered'
                ? 'bg-brand-blue text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
              <div className="h-1 flex-1 mx-2 bg-gray-200">
                <div className={`h-full ${
                  order.status === 'shipped' || 
                  order.status === 'delivered'
                  ? 'bg-brand-blue' : 'bg-gray-200'
                }`}></div>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                order.status === 'shipped' || 
                order.status === 'delivered'
                ? 'bg-brand-blue text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                3
              </div>
              <div className="h-1 flex-1 mx-2 bg-gray-200">
                <div className={`h-full ${
                  order.status === 'delivered'
                  ? 'bg-brand-blue' : 'bg-gray-200'
                }`}></div>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                order.status === 'delivered'
                ? 'bg-brand-blue text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                4
              </div>
            </div>
            
            <div className="flex justify-between text-xs text-center">
              <div className="w-16">Ordered</div>
              <div className="w-16">Processing</div>
              <div className="w-16">Shipped</div>
              <div className="w-16">Delivered</div>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Current Status</div>
                <div className={`text-sm capitalize ${
                  order.status === 'delivered' ? 'text-green-600' : 
                  order.status === 'shipped' ? 'text-brand-blue' : 
                  'text-yellow-600'
                }`}>
                  {order.status}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">Estimated Delivery</div>
                <div className="text-sm">{estimatedDelivery}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Order Details */}
      <div className="px-4">
        <h2 className="font-bold text-lg mb-3">Order Details</h2>
        <Card className="mb-4">
          <CardContent className="p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Order ID</span>
              <span>#{order.id.substr(-6)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Order Date</span>
              <span>{orderDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Payment Method</span>
              <span>{order.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Card'}</span>
            </div>
          </CardContent>
        </Card>
        
        {/* Items */}
        <h2 className="font-bold text-lg mb-3">Items</h2>
        <Card className="mb-4">
          <CardContent className="p-4">
            {order.items.map((item, index) => (
              <React.Fragment key={item.product.id}>
                <div className="flex gap-3 py-2">
                  <img 
                    src={item.product.image} 
                    alt={item.product.name} 
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium line-clamp-2">{item.product.name}</h3>
                    <p className="text-sm text-gray-500">{item.product.brand}</p>
                    <div className="flex justify-between mt-2">
                      <span className="text-sm">Qty: {item.quantity}</span>
                      <span className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                {index < order.items.length - 1 && <Separator className="my-2" />}
              </React.Fragment>
            ))}
            
            <Separator className="my-3" />
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>$5.99</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>${(order.totalAmount * 0.05).toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>${(order.totalAmount + 5.99 + (order.totalAmount * 0.05)).toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Shipping Address */}
        <h2 className="font-bold text-lg mb-3">Shipping Address</h2>
        <Card className="mb-4">
          <CardContent className="p-4 flex">
            <MapPin size={18} className="text-gray-400 mr-2 flex-shrink-0" />
            <p className="text-sm">{order.deliveryAddress}</p>
          </CardContent>
        </Card>
        
        {/* Support */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Need Help?</h3>
                <p className="text-sm text-gray-500">Contact our support team</p>
              </div>
              <Button size="sm" variant="outline">Contact</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const MapPin = Truck; // Using Truck icon as a substitute for MapPin

export default OrderDetailsPage;
