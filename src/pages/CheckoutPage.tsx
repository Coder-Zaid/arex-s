import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useOrder } from '@/context/OrderContext';
import { ChevronLeft, MapPin, CreditCard, AlertCircle, DollarSign } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAppSettings } from '@/context/AppSettingsContext';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { createOrder } = useOrder();
  const { toast } = useToast();
  const { currency, currencySymbol, language, translations } = useAppSettings();
  const t = translations[language];
  
  const [address, setAddress] = useState(user?.address || '');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (items.length === 0) {
    navigate('/cart');
    return null;
  }
  
  if (!isAuthenticated) {
    navigate('/login?redirect=checkout');
    return null;
  }
  
  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      toast({
        title: language === 'ar' ? "العنوان مطلوب" : "Address required",
        description: language === 'ar' ? "يرجى إدخال عنوان التسليم" : "Please enter your delivery address",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      createOrder(items, address, paymentMethod);
      navigate('/order-confirmation');
    } catch (error) {
      toast({
        title: language === 'ar' ? "فشل الطلب" : "Order failed",
        description: language === 'ar' ? "حدث خطأ أثناء تقديم طلبك. الرجاء المحاولة مرة أخرى." : "There was an error placing your order. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Format number based on language
  const formatNumber = (num: number) => {
    if (language === 'ar') {
      // Convert to Arabic numerals
      return num.toFixed(2).replace(/\d/g, (d) => 
        String.fromCharCode(1632 + parseInt(d)));
    }
    return num.toFixed(2);
  };
  
  const subtotal = getTotalPrice();
  const shipping = 5.99;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;
  
  return (
    <div className="pb-36">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b shadow-sm p-3 flex items-center">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft />
        </Button>
        <h1 className="font-medium text-center flex-1 mr-8">{language === 'ar' ? 'الدفع' : 'Checkout'}</h1>
      </div>
      
      <div className="p-4">
        <form onSubmit={handleSubmitOrder}>
          {/* Delivery Address */}
          <section className="mb-6">
            <div className="flex items-center mb-4">
              <MapPin size={18} className="mr-2 text-brand-blue" />
              <h2 className="font-bold text-lg text-foreground">{language === 'ar' ? 'عنوان التسليم' : 'Delivery Address'}</h2>
            </div>
            
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="address">{language === 'ar' ? 'العنوان الكامل' : 'Full Address'}</Label>
                    <Input
                      id="address"
                      placeholder={language === 'ar' ? 'أدخل عنوانك الكامل' : 'Enter your full address'}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
          
          {/* Payment Method */}
          <section className="mb-6">
            <div className="flex items-center mb-4">
              <CreditCard size={18} className="mr-2 text-brand-blue" />
              <h2 className="font-bold text-lg text-foreground">{language === 'ar' ? 'طريقة الدفع' : 'Payment Method'}</h2>
            </div>
            
            <Card>
              <CardContent className="p-4">
                <RadioGroup 
                  value={paymentMethod} 
                  onValueChange={(value) => setPaymentMethod(value as 'cash' | 'card')}
                >
                  <div className="flex items-center space-x-2 pb-2 border-b mb-2">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-green-500" />
                        <div>
                          <div className="font-medium">{t.cashOnDelivery}</div>
                          <div className="text-xs text-gray-500">
                            {language === 'ar' ? 'الدفع عند استلام الطلب' : 'Pay when you receive the order'}
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <CreditCard size={16} className="text-blue-500" />
                        <div>
                          <div className="font-medium">{t.cardPayment}</div>
                          <div className="text-xs text-gray-500">
                            {language === 'ar' ? 'ادفع الآن ببطاقتك' : 'Pay now with your card'}
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
            
            {paymentMethod === 'card' && (
              <div className="mt-3 bg-yellow-50 p-3 rounded-md flex items-start">
                <AlertCircle size={16} className="text-yellow-500 mr-2 mt-0.5" />
                <p className="text-sm text-yellow-700">
                  {language === 'ar' 
                    ? 'في هذا العرض التوضيحي، لن تتم معالجة أي مدفوعات فعلية.'
                    : 'In this demo, no actual payment will be processed.'}
                </p>
              </div>
            )}
          </section>
          
          {/* Order Summary */}
          <section className="mb-6">
            <h2 className="font-bold text-lg mb-4 text-foreground">
              {language === 'ar' ? 'ملخص الطلب' : 'Order Summary'}
            </h2>
            
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>
                      {language === 'ar' 
                        ? `المجموع الفرعي (${items.length.toString().replace(/\d/g, (d) => String.fromCharCode(1632 + parseInt(d)))} منتجات)` 
                        : `Subtotal (${items.length} items)`}
                    </span>
                    <span>{currencySymbol}{formatNumber(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{language === 'ar' ? 'الشحن' : 'Shipping'}</span>
                    <span>{currencySymbol}{formatNumber(shipping)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{language === 'ar' ? 'الضريبة' : 'Tax'}</span>
                    <span>{currencySymbol}{formatNumber(tax)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>{language === 'ar' ? 'المجموع' : 'Total'}</span>
                    <span>{currencySymbol}{formatNumber(total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
          
          {/* Place Order Button */}
          <div className="fixed bottom-16 left-0 right-0 p-4 bg-background border-t max-w-[480px] mx-auto">
            <Button 
              type="submit"
              className="w-full bg-brand-blue hover:bg-brand-blue/90 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? (language === 'ar' ? 'جاري المعالجة...' : 'Processing...') 
                : t.placeOrder}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
