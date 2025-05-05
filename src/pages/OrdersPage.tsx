import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useOrder } from '@/context/OrderContext';
import { useTheme } from '@/context/ThemeContext';
import { useAppSettings } from '@/context/AppSettingsContext';
import { ChevronLeft, Package, Clock, CheckCircle, AlertTriangle, XCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const OrdersPage = () => {
  const navigate = useNavigate();
  const { orders } = useOrder();
  const { theme } = useTheme();
  const { language, currency, currencySymbol } = useAppSettings();
  const [searchTerm, setSearchTerm] = useState('');
  
  const pendingOrders = orders.filter(order => order.status === 'pending' || order.status === 'processing');
  const shippedOrders = orders.filter(order => order.status === 'shipped');
  const deliveredOrders = orders.filter(order => order.status === 'delivered');
  const cancelledOrders = orders.filter(order => order.status === 'cancelled');
  
  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
          {language === 'ar' ? 'قيد الانتظار' : 'Pending'}
        </Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
          {language === 'ar' ? 'قيد المعالجة' : 'Processing'}
        </Badge>;
      case 'shipped':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">
          {language === 'ar' ? 'تم الشحن' : 'Shipped'}
        </Badge>;
      case 'delivered':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
          {language === 'ar' ? 'تم التسليم' : 'Delivered'}
        </Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
          {language === 'ar' ? 'تم الإلغاء' : 'Cancelled'}
        </Badge>;
      default:
        return null;
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} className="text-yellow-500" />;
      case 'processing':
        return <Package size={16} className="text-blue-500" />;
      case 'shipped':
        return <Package size={16} className="text-purple-500" />;
      case 'delivered':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'cancelled':
        return <XCircle size={16} className="text-red-500" />;
      default:
        return <AlertTriangle size={16} className="text-gray-500" />;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  return (
    <div className="pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b shadow-sm p-3 flex items-center">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft />
        </Button>
        <h1 className="font-medium text-center flex-1 mr-8">
          {language === 'ar' ? 'طلباتي' : 'My Orders'}
        </h1>
      </div>
      
      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder={language === 'ar' ? 'البحث عن الطلبات...' : 'Search orders...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      
      {searchTerm ? (
        <div className="p-4">
          <h2 className="text-lg font-medium mb-4">
            {language === 'ar' ? 'نتائج البحث' : 'Search Results'}
          </h2>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package className="mx-auto h-12 w-12 opacity-30 mb-2" />
              <p>{language === 'ar' ? 'لا توجد طلبات مطابقة' : 'No matching orders found'}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div 
                  key={order.id} 
                  onClick={() => navigate(`/order/${order.id}`)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${theme === 'dark' ? 'hover:bg-gray-900' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">#{order.id.substring(order.id.length - 6)}</p>
                      <p className="text-sm text-gray-500">{formatDate(order.orderDate)}</p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                  <div className="flex justify-between items-center mt-3">
                    <p className="text-sm">
                      <span className="text-gray-500">{language === 'ar' ? 'المنتجات:' : 'Items:'}</span> {order.items.length}
                    </p>
                    <p className="font-medium">{currencySymbol}{order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="px-4">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="all">{language === 'ar' ? 'الكل' : 'All'}</TabsTrigger>
              <TabsTrigger value="pending">
                <div className="relative">
                  {language === 'ar' ? 'قيد الانتظار' : 'Pending'}
                  {pendingOrders.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {pendingOrders.length}
                    </span>
                  )}
                </div>
              </TabsTrigger>
              <TabsTrigger value="shipped">{language === 'ar' ? 'تم الشحن' : 'Shipped'}</TabsTrigger>
              <TabsTrigger value="delivered">{language === 'ar' ? 'تم التسليم' : 'Delivered'}</TabsTrigger>
              <TabsTrigger value="cancelled">{language === 'ar' ? 'ملغاة' : 'Cancelled'}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              {orders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="mx-auto h-12 w-12 opacity-30 mb-2" />
                  <p>{language === 'ar' ? 'لا توجد طلبات' : 'No orders yet'}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div 
                      key={order.id} 
                      onClick={() => navigate(`/order/${order.id}`)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${theme === 'dark' ? 'hover:bg-gray-900' : 'hover:bg-gray-50'}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          {getStatusIcon(order.status)}
                          <div className="ml-2">
                            <p className="font-medium">#{order.id.substring(order.id.length - 6)}</p>
                            <p className="text-sm text-gray-500">{formatDate(order.orderDate)}</p>
                          </div>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <p className="text-sm">
                          <span className="text-gray-500">{language === 'ar' ? 'المنتجات:' : 'Items:'}</span> {order.items.length}
                        </p>
                        <p className="font-medium">{currencySymbol}{order.totalAmount.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="pending">
              {pendingOrders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="mx-auto h-12 w-12 opacity-30 mb-2" />
                  <p>{language === 'ar' ? 'لا توجد طلبات قيد الانتظار' : 'No pending orders'}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingOrders.map((order) => (
                    <div 
                      key={order.id} 
                      onClick={() => navigate(`/order/${order.id}`)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${theme === 'dark' ? 'hover:bg-gray-900' : 'hover:bg-gray-50'}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          {getStatusIcon(order.status)}
                          <div className="ml-2">
                            <p className="font-medium">#{order.id.substring(order.id.length - 6)}</p>
                            <p className="text-sm text-gray-500">{formatDate(order.orderDate)}</p>
                          </div>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <p className="text-sm">
                          <span className="text-gray-500">{language === 'ar' ? 'المنتجات:' : 'Items:'}</span> {order.items.length}
                        </p>
                        <p className="font-medium">{currencySymbol}{order.totalAmount.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            {/* Other tab contents follow the same pattern */}
            <TabsContent value="shipped">
              {shippedOrders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="mx-auto h-12 w-12 opacity-30 mb-2" />
                  <p>{language === 'ar' ? 'لا توجد طلبات تم شحنها' : 'No shipped orders'}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {shippedOrders.map((order) => (
                    <div 
                      key={order.id} 
                      onClick={() => navigate(`/order/${order.id}`)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${theme === 'dark' ? 'hover:bg-gray-900' : 'hover:bg-gray-50'}`}
                    >
                      {/* Same pattern as above */}
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          {getStatusIcon(order.status)}
                          <div className="ml-2">
                            <p className="font-medium">#{order.id.substring(order.id.length - 6)}</p>
                            <p className="text-sm text-gray-500">{formatDate(order.orderDate)}</p>
                          </div>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <p className="text-sm">
                          <span className="text-gray-500">{language === 'ar' ? 'المنتجات:' : 'Items:'}</span> {order.items.length}
                        </p>
                        <p className="font-medium">{currencySymbol}{order.totalAmount.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="delivered">
              {deliveredOrders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="mx-auto h-12 w-12 opacity-30 mb-2" />
                  <p>{language === 'ar' ? 'لا توجد طلبات تم تسليمها' : 'No delivered orders'}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {deliveredOrders.map((order) => (
                    <div 
                      key={order.id} 
                      onClick={() => navigate(`/order/${order.id}`)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${theme === 'dark' ? 'hover:bg-gray-900' : 'hover:bg-gray-50'}`}
                    >
                      {/* Same pattern as above */}
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          {getStatusIcon(order.status)}
                          <div className="ml-2">
                            <p className="font-medium">#{order.id.substring(order.id.length - 6)}</p>
                            <p className="text-sm text-gray-500">{formatDate(order.orderDate)}</p>
                          </div>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <p className="text-sm">
                          <span className="text-gray-500">{language === 'ar' ? 'المنتجات:' : 'Items:'}</span> {order.items.length}
                        </p>
                        <p className="font-medium">{currencySymbol}{order.totalAmount.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="cancelled">
              {cancelledOrders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <XCircle className="mx-auto h-12 w-12 opacity-30 mb-2" />
                  <p>{language === 'ar' ? 'لا توجد طلبات ملغاة' : 'No cancelled orders'}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cancelledOrders.map((order) => (
                    <div 
                      key={order.id} 
                      onClick={() => navigate(`/order/${order.id}`)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${theme === 'dark' ? 'hover:bg-gray-900' : 'hover:bg-gray-50'}`}
                    >
                      {/* Same pattern as above */}
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          {getStatusIcon(order.status)}
                          <div className="ml-2">
                            <p className="font-medium">#{order.id.substring(order.id.length - 6)}</p>
                            <p className="text-sm text-gray-500">{formatDate(order.orderDate)}</p>
                          </div>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <p className="text-sm">
                          <span className="text-gray-500">{language === 'ar' ? 'المنتجات:' : 'Items:'}</span> {order.items.length}
                        </p>
                        <p className="font-medium">{currencySymbol}{order.totalAmount.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
