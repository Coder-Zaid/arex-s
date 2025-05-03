
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
import { ChevronLeft, MapPin, CreditCard, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getTotalPrice } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { createOrder } = useOrder();
  const { toast } = useToast();
  
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
        title: "Address required",
        description: "Please enter your delivery address",
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
        title: "Order failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const subtotal = getTotalPrice();
  const shipping = 5.99;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;
  
  return (
    <div className="pb-36">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm p-3 flex items-center">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft />
        </Button>
        <h1 className="font-medium text-center flex-1 mr-8">Checkout</h1>
      </div>
      
      <div className="p-4">
        <form onSubmit={handleSubmitOrder}>
          {/* Delivery Address */}
          <section className="mb-6">
            <div className="flex items-center mb-4">
              <MapPin size={18} className="mr-2 text-brand-blue" />
              <h2 className="font-bold text-lg">Delivery Address</h2>
            </div>
            
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="address">Full Address</Label>
                    <Input
                      id="address"
                      placeholder="Enter your full address"
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
              <h2 className="font-bold text-lg">Payment Method</h2>
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
                      <div className="font-medium">Cash on Delivery</div>
                      <div className="text-xs text-gray-500">Pay when you receive the order</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer">
                      <div className="font-medium">Credit/Debit Card</div>
                      <div className="text-xs text-gray-500">Pay now with your card</div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
            
            {paymentMethod === 'card' && (
              <div className="mt-3 bg-yellow-50 p-3 rounded-md flex items-start">
                <AlertCircle size={16} className="text-yellow-500 mr-2 mt-0.5" />
                <p className="text-sm text-yellow-700">
                  In this demo, no actual payment will be processed.
                </p>
              </div>
            )}
          </section>
          
          {/* Order Summary */}
          <section className="mb-6">
            <h2 className="font-bold text-lg mb-4">Order Summary</h2>
            
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal ({items.length} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
          
          {/* Place Order Button */}
          <div className="fixed bottom-16 left-0 right-0 p-4 bg-white border-t">
            <Button 
              type="submit"
              className="w-full bg-brand-blue hover:bg-brand-blue/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Place Order'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
