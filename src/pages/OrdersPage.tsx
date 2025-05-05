
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useOrder } from '@/context/OrderContext';
import { ChevronLeft, Package, ChevronRight, PackageX } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAppSettings } from '@/context/AppSettingsContext';

const OrdersPage = () => {
  const navigate = useNavigate();
  const { orders } = useOrder();
  const { language, translations } = useAppSettings();
  const t = translations[language];
  const [activeStatus, setActiveStatus] = useState<string>('all');
  
  // Filter orders by status
  const filteredOrders = activeStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeStatus);
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  const getStatusClass = (status: string) => {
    switch(status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'shipped':
        return 'bg-purple-100 text-purple-700';
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };
  
  // Empty state
  if (orders.length === 0) {
    return (
      <div className="p-4 flex flex-col items-center justify-center h-[70vh]">
        <PackageX size={64} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-bold mb-2">{t.noOrders}</h2>
        <p className="text-gray-500 text-center mb-4">
          {language === 'ar' 
            ? 'ابدأ التسوق لرؤية طلباتك هنا.'
            : 'Start shopping to see your orders here.'}
        </p>
        <Button onClick={() => navigate('/')}>
          {language === 'ar' ? 'تسوق الآن' : 'Shop Now'}
        </Button>
      </div>
    );
  }
  
  return (
    <div className="pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm p-3 flex items-center">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft />
        </Button>
        <h1 className="font-medium text-center flex-1 mr-8">
          {t.orders}
        </h1>
      </div>
      
      {/* Status Tabs */}
      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveStatus}>
        <TabsList className="grid grid-cols-5 h-auto p-1 overflow-x-auto no-scrollbar">
          <TabsTrigger value="all" className="text-xs py-1">
            {language === 'ar' ? 'الكل' : 'All'}
          </TabsTrigger>
          <TabsTrigger value="pending" className="text-xs py-1">
            {language === 'ar' ? 'قيد الانتظار' : 'Pending'}
          </TabsTrigger>
          <TabsTrigger value="processing" className="text-xs py-1">
            {language === 'ar' ? 'قيد المعالجة' : 'Processing'}
          </TabsTrigger>
          <TabsTrigger value="shipped" className="text-xs py-1">
            {language === 'ar' ? 'تم الشحن' : 'Shipped'}
          </TabsTrigger>
          <TabsTrigger value="delivered" className="text-xs py-1">
            {language === 'ar' ? 'تم التوصيل' : 'Delivered'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeStatus} className="p-4">
          {filteredOrders.length > 0 ? (
            <div className="space-y-3">
              {filteredOrders.map((order) => (
                <Card key={order.id} onClick={() => navigate(`/order/${order.id}`)}>
                  <CardContent className="p-3 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Package className="mr-3 text-gray-400" size={18} />
                        <div>
                          <p className="font-medium text-sm">
                            {language === 'ar' ? 'طلب رقم' : 'Order #'} {order.id.substr(-6)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(order.orderDate)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className={`text-xs px-2 py-1 rounded ${getStatusClass(order.status)}`}>
                          {language === 'ar' 
                            ? order.status === 'pending' ? 'قيد الانتظار'
                              : order.status === 'processing' ? 'قيد المعالجة'
                              : order.status === 'shipped' ? 'تم الشحن'
                              : order.status === 'delivered' ? 'تم التوصيل'
                              : 'تم الإلغاء'
                            : order.status.charAt(0).toUpperCase() + order.status.slice(1)
                          }
                        </span>
                        <ChevronRight size={16} className="text-gray-400 ml-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-8">
              <p className="text-gray-500">
                {language === 'ar' 
                  ? 'لا توجد طلبات في هذه الحالة'
                  : 'No orders with this status'}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrdersPage;
