
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useOrder } from '@/context/OrderContext';
import { useAppSettings } from '@/context/AppSettingsContext';

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const { orders } = useOrder();
  const { currency, currencySymbol, language, translations } = useAppSettings();
  const t = translations[language];
  
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
  
  // Format number based on language
  const formatNumber = (num: number) => {
    if (language === 'ar') {
      // Convert to Arabic numerals
      return num.toFixed(2).replace(/\d/g, (d) => String.fromCharCode(1632 + parseInt(d)));
    }
    return num.toFixed(2);
  };
  
  // Apply exchange rate for currencies (approximate USD:SAR ratio)
  const adjustCurrency = (amount: number) => {
    if (currency === 'USD' && latestOrder.currency === 'SAR') {
      return amount / 3.75; // Convert from SAR to USD
    } else if (currency === 'SAR' && latestOrder.currency === 'USD') {
      return amount * 3.75; // Convert from USD to SAR
    }
    return amount;
  };
  
  const totalAmount = adjustCurrency(latestOrder.totalAmount);
  
  return (
    <div className="p-4 flex flex-col items-center justify-center min-h-[80vh]">
      <CheckCircle size={80} className="text-green-500 mb-4" />
      
      <h1 className="text-2xl font-bold text-center mb-2">
        {language === 'ar' ? 'تم تأكيد الطلب!' : 'Order Confirmed!'}
      </h1>
      <p className="text-gray-500 text-center mb-6">
        {language === 'ar' 
          ? 'شكراً لطلبك. تم استلام طلبك.'
          : 'Thank you for your order. Your order has been received.'}
      </p>
      
      <div className="w-full max-w-sm bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-gray-500">{language === 'ar' ? 'رقم الطلب:' : 'Order ID:'}</span>
          <span className="font-medium">#{language === 'ar' 
            ? orderId.replace(/\d/g, (d) => String.fromCharCode(1632 + parseInt(d)))
            : orderId}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-500">{language === 'ar' ? 'التاريخ:' : 'Date:'}</span>
          <span>
            {language === 'ar' 
              ? new Date(latestOrder.orderDate).toLocaleDateString('ar-SA')
              : new Date(latestOrder.orderDate).toLocaleDateString()}
          </span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-500">{language === 'ar' ? 'المجموع:' : 'Total:'}</span>
          <span className="font-medium">{currencySymbol}{formatNumber(totalAmount)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">{language === 'ar' ? 'طريقة الدفع:' : 'Payment Method:'}</span>
          <span>
            {latestOrder.paymentMethod === 'cash' 
              ? (language === 'ar' ? 'الدفع عند الاستلام' : 'Cash on Delivery')
              : (language === 'ar' ? 'بطاقة ائتمان' : 'Card')}
          </span>
        </div>
      </div>
      
      <div className="space-y-4 w-full max-w-sm">
        <Button 
          className="w-full bg-brand-blue hover:bg-brand-blue/90"
          onClick={() => navigate(`/order/${latestOrder.id}`)}
        >
          {language === 'ar' ? 'عرض تفاصيل الطلب' : 'View Order Details'}
        </Button>
        
        <Button 
          variant="outline"
          className="w-full"
          onClick={() => navigate('/')}
        >
          {language === 'ar' ? 'مواصلة التسوق' : 'Continue Shopping'}
        </Button>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
