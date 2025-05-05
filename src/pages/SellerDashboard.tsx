
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTheme } from '@/context/ThemeContext';
import { useAppSettings } from '@/context/AppSettingsContext';
import { Package, ShoppingCart, Users, TrendingUp, CreditCard, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SellerDashboard = () => {
  const { theme } = useTheme();
  const { language, translations, currency, currencySymbol } = useAppSettings();
  const navigate = useNavigate();
  const t = translations[language];
  
  return (
    <div className="pb-20">
      {/* Header */}
      <div className={`p-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-blue-50'}`}>
        <h1 className="text-xl font-bold mb-1">{language === 'ar' ? 'لوحة تحكم البائع' : 'Seller Dashboard'}</h1>
        <p className="text-sm opacity-70">{language === 'ar' ? 'مرحبًا بك في لوحة تحكم البائع' : 'Welcome to your seller dashboard'}</p>
      </div>
      
      {/* Dashboard Tabs */}
      <div className="p-4">
        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="overview">{language === 'ar' ? 'نظرة عامة' : 'Overview'}</TabsTrigger>
            <TabsTrigger value="products">{language === 'ar' ? 'المنتجات' : 'Products'}</TabsTrigger>
            <TabsTrigger value="orders">{language === 'ar' ? 'الطلبات' : 'Orders'}</TabsTrigger>
            <TabsTrigger value="analytics">{language === 'ar' ? 'التحليلات' : 'Analytics'}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            {/* Overview Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center">
                    <ShoppingCart size={16} className="mr-2 text-blue-500" />
                    {language === 'ar' ? 'الطلبات' : 'Orders'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">24</p>
                  <p className="text-xs opacity-70">{language === 'ar' ? 'هذا الشهر' : 'This month'}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center">
                    <TrendingUp size={16} className="mr-2 text-green-500" />
                    {language === 'ar' ? 'الإيرادات' : 'Revenue'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{currencySymbol}1,248</p>
                  <p className="text-xs opacity-70">{language === 'ar' ? 'هذا الشهر' : 'This month'}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center">
                    <Package size={16} className="mr-2 text-purple-500" />
                    {language === 'ar' ? 'المنتجات' : 'Products'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">36</p>
                  <p className="text-xs opacity-70">{language === 'ar' ? 'المجموع' : 'Total'}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center">
                    <Users size={16} className="mr-2 text-orange-500" />
                    {language === 'ar' ? 'العملاء' : 'Customers'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">128</p>
                  <p className="text-xs opacity-70">{language === 'ar' ? 'المجموع' : 'Total'}</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {language === 'ar' ? 'الطلبات الحديثة' : 'Recent Orders'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex justify-between items-center border-b pb-3">
                      <div>
                        <p className="font-medium">Order #{i}12345</p>
                        <p className="text-sm opacity-70">
                          {language === 'ar' ? '3 منتجات' : '3 products'} • {currencySymbol}79.99
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span className={`inline-block rounded-full w-2 h-2 mr-2 ${i === 1 ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
                        <span className="text-sm">
                          {i === 1 ? (language === 'ar' ? 'قيد المعالجة' : 'Processing') : (language === 'ar' ? 'تم الشحن' : 'Shipped')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  {language === 'ar' ? 'عرض جميع الطلبات' : 'View All Orders'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{language === 'ar' ? 'منتجاتك' : 'Your Products'}</CardTitle>
                  <Button size="sm" onClick={() => navigate('/seller/products')}>
                    {language === 'ar' ? 'إدارة المنتجات' : 'Manage Products'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center border-b pb-3">
                      <div className="h-12 w-12 bg-gray-200 rounded-md mr-3"></div>
                      <div className="flex-1">
                        <p className="font-medium">Product Name {i}</p>
                        <p className="text-sm opacity-70">
                          {i === 2 ? (
                            <span className="text-amber-500">
                              {language === 'ar' ? 'مخزون منخفض: 8' : 'Low stock: 8'}
                            </span>
                          ) : (
                            <span className="text-green-600">
                              {language === 'ar' ? 'المخزون' : 'In stock'}: {i === 1 ? 24 : i === 3 ? 15 : 32}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{currencySymbol}39.99</p>
                        <p className="text-xs opacity-70">{i % 2 === 0 ? (language === 'ar' ? 'نشط' : 'Active') : (language === 'ar' ? 'مسودة' : 'Draft')}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="outline" 
                  className="w-full mt-4" 
                  onClick={() => navigate('/seller/products/add')}
                >
                  {language === 'ar' ? 'إضافة منتج جديد' : 'Add New Product'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'ar' ? 'إدارة الطلبات' : 'Order Management'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-3">
                      <div>
                        <p className="font-medium">Order #{100000 + i}</p>
                        <div className="flex items-center text-sm">
                          <Clock size={12} className="mr-1 opacity-70" />
                          <span className="opacity-70">June 1{i}, 2023</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="mr-4 text-right">
                          <p>{currencySymbol}{45 + i * 10}.99</p>
                          <p className="text-xs opacity-70">
                            {i % 3 === 0 ? (language === 'ar' ? 'قيد المعالجة' : 'Processing') : 
                             i % 3 === 1 ? (language === 'ar' ? 'تم الشحن' : 'Shipped') : 
                             (language === 'ar' ? 'تم التسليم' : 'Delivered')}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          {language === 'ar' ? 'التفاصيل' : 'Details'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'ar' ? 'تحليلات المبيعات' : 'Sales Analytics'}</CardTitle>
              </CardHeader>
              <CardContent className="h-80 flex justify-center items-center">
                <div className="text-center opacity-70">
                  <p>{language === 'ar' ? 'الرسوم البيانية للتحليلات ستظهر هنا' : 'Analytics charts will appear here'}</p>
                  <p className="text-sm">{language === 'ar' ? 'قريباً' : 'Coming soon'}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SellerDashboard;
