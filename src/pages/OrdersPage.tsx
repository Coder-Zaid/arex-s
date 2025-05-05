
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PackageX, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOrder } from '@/context/OrderContext';
import { useAppSettings } from '@/context/AppSettingsContext';

const OrdersPage = () => {
  const navigate = useNavigate();
  const { orders } = useOrder();
  const { language, translations } = useAppSettings();
  const t = translations[language];

  // If there are no orders, show an empty state
  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center">
        <PackageX size={64} className="text-gray-300 mb-4" />
        <h1 className="text-xl font-bold mb-2">{t.noOrders}</h1>
        <p className="text-gray-500 mb-6">Start shopping and your orders will appear here.</p>
        <Button 
          onClick={() => navigate('/')}
          className="animate-pulse hover:animate-none"
        >
          <ShoppingCart size={16} className="mr-2" />
          Start Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <div 
            key={order.id} 
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="bg-gray-50 p-3 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Order #{order.id.slice(0, 8)}</p>
                <p className="text-xs text-gray-500">
                  {new Date(order.orderDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
            
            <div className="p-3">
              <div className="text-sm mb-2">
                <span className="font-medium">{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span>
                <span className="mx-2">•</span>
                <span className="font-medium">Total: ${order.totalAmount.toFixed(2)}</span>
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-2">
                {order.items.slice(0, 3).map((item, index) => (
                  <div key={index} className="min-w-[60px] w-[60px] h-[60px] rounded-md overflow-hidden">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                {order.items.length > 3 && (
                  <div className="min-w-[60px] w-[60px] h-[60px] bg-gray-100 rounded-md flex items-center justify-center text-gray-500 text-sm">
                    +{order.items.length - 3}
                  </div>
                )}
              </div>
              
              <Button 
                onClick={() => navigate(`/order/${order.id}`)}
                variant="outline" 
                className="w-full mt-2 hover:bg-gray-50 transition-colors duration-200"
              >
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
