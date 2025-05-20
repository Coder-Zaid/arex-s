import React, { useState, useEffect } from 'react';
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
import { ChevronLeft, MapPin, CreditCard, AlertCircle, DollarSign, User, Phone } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAppSettings } from '@/context/AppSettingsContext';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import jsPDF from 'jspdf';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import RiyalSymbol from '@/components/ui/RiyalSymbol';

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Name must be at least 2 characters."
  }),
  phone: z.string().min(6, {
    message: "Phone number must be at least 6 digits."
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters."
  })
});

type FormValues = z.infer<typeof formSchema>;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { createOrder } = useOrder();
  const { toast } = useToast();
  const { currency, currencySymbol, language, translations, convertPrice } = useAppSettings();
  const t = translations[language];
  
  // Default form values
  const defaultValues = {
    fullName: user?.displayName || '',
    phone: user?.phone || '',
    address: user?.address || ''
  };
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });
  
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<any>(null);
  const [redirect, setRedirect] = useState('');
  
  useEffect(() => {
    if (items.length === 0) {
      setRedirect('/cart');
    } else if (!isAuthenticated) {
      setRedirect('/login?redirect=checkout');
    }
  }, [items.length, isAuthenticated]);
  
  useEffect(() => {
    if (redirect) {
      navigate(redirect);
    }
  }, [redirect, navigate]);
  
  if (redirect) {
    return <div className="p-8 text-center">Redirecting...</div>;
  }
  
  const handleSubmitOrder = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      createOrder(items, values.address, paymentMethod);
      // Generate PDF invoice
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text('AREX Invoice', 14, 20);
      doc.setFontSize(12);
      doc.text(`Customer: ${values.fullName}`, 14, 35);
      doc.text(`Phone: ${values.phone}`, 14, 42);
      doc.text(`Address: ${values.address}`, 14, 49);
      doc.text(`Date: ${new Date().toLocaleString()}`, 14, 56);
      doc.text('----------------------------------------', 14, 62);
      let y = 70;
      items.forEach((item, idx) => {
        doc.text(`${idx + 1}. ${item.product.name} x${item.quantity} - ${currency === 'SAR' ? <>SAR {formatNumber(convertPrice(item.product.price, 'SAR'))}</> : <>{currencySymbol}{formatNumber(convertPrice(item.product.price, 'SAR'))}</> }`, 14, y);
        y += 7;
      });
      doc.text('----------------------------------------', 14, y);
      y += 7;
      doc.text(`Subtotal: ${currency === 'SAR' ? <>SAR {formatNumber(subtotal)}</> : <>{currencySymbol}{formatNumber(subtotal)}</> }`, 14, y);
      y += 7;
      doc.text(`Shipping: ${currency === 'SAR' ? <>SAR {formatNumber(shipping)}</> : <>{currencySymbol}{formatNumber(shipping)}</> }`, 14, y);
      y += 7;
      doc.text(`Tax: ${currency === 'SAR' ? <>SAR {formatNumber(tax)}</> : <>{currencySymbol}{formatNumber(tax)}</> }`, 14, y);
      y += 7;
      doc.text(`Total: ${currency === 'SAR' ? <>SAR {formatNumber(total)}</> : <>{currencySymbol}{formatNumber(total)}</> }`, 14, y);
      // Convert PDF to base64
      const pdfBase64 = doc.output('datauristring');
      // Show confirmation modal
      setPendingOrder({
        email: user.email,
        name: values.fullName,
        orderDetails: `Order placed on ${new Date().toLocaleString()}\nTotal: ${currency === 'SAR' ? <>SAR {formatNumber(total)}</> : <>{currencySymbol}{formatNumber(total)}</> }\nItems: ${items.map(i => `${i.product.name} x${i.quantity}`).join(', ')}`,
        pdfBase64,
      });
      setShowConfirmModal(true);
    } catch (error) {
      toast({
        title: language === 'ar' ? "فشل الطلب" : "Order failed",
        description: language === 'ar' ? "حدث خطأ أثناء تقديم طلبك. الرجاء المحاولة مرة أخرى." : "There was an error placing your order. Please try again.",
        variant: "destructive",
      });
      console.error(error);
      setIsSubmitting(false);
    }
  };
  
  const handleConfirmSend = () => {
    setShowConfirmModal(false);
    setIsSubmitting(true);
    if (!pendingOrder) return;
    // Nice message and PDF download link
    const message = `Thank you for your order!\n\nOrder Details:\n${pendingOrder.orderDetails}\n\nYou can download your invoice as a PDF here: [Download Invoice](${pendingOrder.pdfBase64})`;
    // Show confirmation modal
    setPendingOrder({
      email: user.email,
      name: pendingOrder.name,
      orderDetails: message,
      pdfBase64: pendingOrder.pdfBase64,
    });
    setShowConfirmModal(true);
  };
  
  const handleCancelSend = () => {
    setShowConfirmModal(false);
    setPendingOrder(null);
    toast({
      title: language === 'ar' ? 'تم الإلغاء' : 'Cancelled',
      description: language === 'ar' ? 'لم يتم إرسال تفاصيل الطلب.' : 'Order details were not sent.',
    });
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
  // Define fixed shipping costs in SAR and convert based on currency
  const shippingInSAR = 22.46; 
  const shipping = convertPrice(shippingInSAR, 'SAR');
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + shipping + tax;
  
  return (
    <div className="pb-36 min-h-screen w-full bg-transparent">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b shadow-sm p-3 flex items-center">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft />
        </Button>
        <h1 className="font-medium text-center flex-1 mr-8">{language === 'ar' ? 'الدفع' : 'Checkout'}</h1>
      </div>
      
      <div className="p-4">
        <div className="max-w-xl mx-auto bg-transparent">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmitOrder)}>
            {/* Customer Information */}
            <section className="mb-6">
              <div className="flex items-center mb-4">
                <User size={18} className="mr-2 text-brand-blue" />
                <h2 className="font-bold text-lg text-foreground">{language === 'ar' ? 'معلومات العميل' : 'Customer Information'}</h2>
              </div>
              
              <div className="p-4 mb-4">
                <div className="space-y-3">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{language === 'ar' ? 'الاسم الكامل' : 'Full Name'}</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={language === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={language === 'ar' ? 'أدخل رقم هاتفك' : 'Enter your phone number'}
                            type="tel"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </section>
            
            {/* Delivery Address */}
            <section className="mb-6">
              <div className="flex items-center mb-4">
                <MapPin size={18} className="mr-2 text-brand-blue" />
                <h2 className="font-bold text-lg text-foreground">{language === 'ar' ? 'عنوان التسليم' : 'Delivery Address'}</h2>
              </div>
              
              <div className="p-4 mb-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{language === 'ar' ? 'العنوان الكامل' : 'Full Address'}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={language === 'ar' ? 'أدخل عنوانك الكامل' : 'Enter your full address'}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>
            
            {/* Payment Method */}
            <section className="mb-6">
              <div className="flex items-center mb-4">
                <CreditCard size={18} className="mr-2 text-brand-blue" />
                <h2 className="font-bold text-lg text-foreground">{language === 'ar' ? 'طريقة الدفع' : 'Payment Method'}</h2>
              </div>
              
              <div className="p-4 mb-4">
                <RadioGroup 
                  value={paymentMethod} 
                  onValueChange={(value) => setPaymentMethod(value as 'cash' | 'card')}
                >
                  <div className="flex items-center space-x-2 rtl:space-x-reverse pb-2 border-b mb-2">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-green-500" />
                        <div>
                          <div className="font-medium">{t.cashOnDelivery}</div>
                          <div className="text-xs text-black dark:text-white">
                            {language === 'ar' ? 'الدفع عند استلام الطلب' : 'Pay when you receive the order'}
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <CreditCard size={16} className="text-blue-500" />
                        <div>
                          <div className="font-medium">{t.cardPayment}</div>
                          <div className="text-xs text-black dark:text-white">
                            {language === 'ar' ? 'ادفع الآن ببطاقتك' : 'Pay now with your card'}
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              {paymentMethod === 'card' && (
                <div className="mt-3 bg-yellow-50 p-3 rounded-md flex items-start">
                  <AlertCircle size={16} className="text-yellow-500 mr-2 rtl:ml-2 rtl:mr-0 mt-0.5" />
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
              
              <div className="p-4 mb-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>
                      {language === 'ar' 
                        ? `المجموع الفرعي (${items.length.toString().replace(/\d/g, (d) => String.fromCharCode(1632 + parseInt(d)))} منتجات)` 
                        : `Subtotal (${items.length} items)`}
                    </span>
                    <span>{currency === 'SAR' ? <>SAR {formatNumber(subtotal)}</> : <>{currencySymbol}{formatNumber(subtotal)}</> }</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{language === 'ar' ? 'الشحن' : 'Shipping'}</span>
                    <span>{currency === 'SAR' ? <>SAR {formatNumber(shipping)}</> : <>{currencySymbol}{formatNumber(shipping)}</> }</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{language === 'ar' ? 'الضريبة' : 'Tax'}</span>
                    <span>{currency === 'SAR' ? <>SAR {formatNumber(tax)}</> : <>{currencySymbol}{formatNumber(tax)}</> }</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span className="font-bold text-foreground">{language === 'ar' ? 'المجموع' : 'Total'}</span>
                    <span>{currency === 'SAR' ? <>SAR {formatNumber(total)}</> : <>{currencySymbol}{formatNumber(total)}</> }</span>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Place Order Button */}
            <div className="fixed bottom-16 left-0 right-0 p-4 bg-transparent border-t-0 max-w-[480px] mx-auto">
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
        </Form>
        </div>
      </div>
      
      {/* Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="max-w-md mx-auto text-center">
          <h2 className="text-xl font-bold mb-2">Confirm Your Email</h2>
          <p className="mb-4">Please confirm your email address before sending your order details and invoice to the owner:</p>
          <div className="mb-4 p-3 rounded bg-white/10 text-black dark:text-white">
            <strong>Email:</strong> {pendingOrder?.email}<br/>
            <strong>Name:</strong> {pendingOrder?.name}
          </div>
          <Button className="w-full mb-2" onClick={handleConfirmSend} disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Order Details'}
          </Button>
          <Button className="w-full" variant="outline" onClick={handleCancelSend} disabled={isSubmitting}>
            Cancel
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CheckoutPage;
