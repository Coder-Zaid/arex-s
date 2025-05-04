
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useOrder } from '@/context/OrderContext';
import { useAppSettings } from '@/context/AppSettingsContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const OrderDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getOrderById, cancelOrder } = useOrder();
  const { currencySymbol, currency, language, translations } = useAppSettings();
  const t = translations[language];

  const order = id ? getOrderById(id) : undefined;

  if (!order) {
    return (
      <div className="p-4 text-center">
        <h1 className="text-xl font-semibold mb-4">{language === 'ar' ? 'الطلب غير موجود' : 'Order Not Found'}</h1>
        <Button onClick={() => navigate('/')}>{language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}</Button>
      </div>
    );
  }

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
    if (currency === 'USD' && order.currency === 'SAR') {
      return amount / 3.75; // Convert from SAR to USD
    } else if (currency === 'SAR' && order.currency === 'USD') {
      return amount * 3.75; // Convert from USD to SAR
    }
    return amount;
  };

  // Check if the order can be cancelled (pending or processing)
  const canCancel = ['pending', 'processing'].includes(order.status);

  const handleCancelOrder = () => {
    cancelOrder(order.id);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        {language === 'ar' ? 'تفاصيل الطلب' : 'Order Details'}
      </h1>

      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-gray-500">{language === 'ar' ? 'رقم الطلب:' : 'Order ID:'}</span>
          <span className="font-medium">
            #{language === 'ar'
              ? order.id.substr(-6).replace(/\d/g, (d) => String.fromCharCode(1632 + parseInt(d)))
              : order.id.substr(-6)}
          </span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-500">{language === 'ar' ? 'الحالة:' : 'Status:'}</span>
          <span className={`capitalize ${
            order.status === 'delivered' ? 'text-green-500' : 
            order.status === 'cancelled' ? 'text-red-500' : 'text-brand-blue'
          }`}>
            {language === 'ar' ? 
              (order.status === 'pending' ? 'قيد الانتظار' : 
              order.status === 'processing' ? 'قيد المعالجة' : 
              order.status === 'shipped' ? 'تم الشحن' : 
              order.status === 'delivered' ? 'تم التوصيل' :
              order.status === 'cancelled' ? 'تم الإلغاء' : '') : 
              order.status}
          </span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-500">{language === 'ar' ? 'التاريخ:' : 'Date:'}</span>
          <span>
            {language === 'ar'
              ? new Date(order.orderDate).toLocaleDateString('ar-SA')
              : new Date(order.orderDate).toLocaleDateString()}
          </span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-500">{language === 'ar' ? 'طريقة الدفع:' : 'Payment Method:'}</span>
          <span>
            {order.paymentMethod === 'cash'
              ? (language === 'ar' ? 'الدفع عند الاستلام' : 'Cash on Delivery')
              : (language === 'ar' ? 'بطاقة ائتمان' : 'Card')}
          </span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-500">{language === 'ar' ? 'عنوان التوصيل:' : 'Delivery Address:'}</span>
          <span className="text-right">{order.deliveryAddress}</span>
        </div>
      </div>

      <h2 className="font-semibold text-lg mb-3">
        {language === 'ar' ? 'المنتجات' : 'Products'}
      </h2>

      <div className="space-y-3 mb-6">
        {order.items.map((item) => (
          <div key={item.product.id} className="flex justify-between items-center border-b pb-3">
            <div className="flex items-center space-x-3">
              <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded" />
              <div>
                <h3 className="font-medium">{item.product.name}</h3>
                <p className="text-sm text-gray-500">
                  {language === 'ar'
                    ? `الكمية: ${String(item.quantity).replace(/\d/g, (d) => String.fromCharCode(1632 + parseInt(d)))}`
                    : `Qty: ${item.quantity}`}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium">
                {currencySymbol}{formatNumber(adjustCurrency(item.product.price * item.quantity))}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
        <div className="flex justify-between font-medium text-lg">
          <span>{language === 'ar' ? 'المجموع:' : 'Total:'}</span>
          <span>{currencySymbol}{formatNumber(adjustCurrency(order.totalAmount))}</span>
        </div>
      </div>

      <div className="flex space-x-3 space-y-0 rtl:space-x-reverse">
        <Button
          variant="outline"
          onClick={() => navigate('/')}
        >
          {language === 'ar' ? 'العودة للتسوق' : 'Continue Shopping'}
        </Button>
        
        {canCancel && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                {language === 'ar' ? 'إلغاء الطلب' : 'Cancel Order'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {language === 'ar' ? 'تأكيد إلغاء الطلب' : 'Confirm Order Cancellation'}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {language === 'ar'
                    ? 'هل أنت متأكد من رغبتك في إلغاء هذا الطلب؟ لا يمكن التراجع عن هذا الإجراء.'
                    : 'Are you sure you want to cancel this order? This action cannot be undone.'}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  {language === 'ar' ? 'تراجع' : 'Cancel'}
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleCancelOrder}>
                  {language === 'ar' ? 'نعم، إلغاء الطلب' : 'Yes, Cancel Order'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsPage;
