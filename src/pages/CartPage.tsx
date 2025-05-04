
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/context/CartContext';
import { ChevronLeft, Trash2, ShoppingBag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const CartPage = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, getTotalPrice } = useCart();
  
  if (items.length === 0) {
    return (
      <div className="p-4 flex flex-col items-center justify-center h-[70vh]">
        <ShoppingBag size={64} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 text-center mb-4">
          Looks like you haven't added any products to your cart yet.
        </p>
        <Button onClick={() => navigate('/')}>Start Shopping</Button>
      </div>
    );
  }
  
  return (
    <div className="pb-36">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm p-3 flex items-center">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft />
        </Button>
        <Button 
          variant="ghost"
          className="font-medium text-center flex-1 mr-8"
          onClick={() => navigate('/cart')}
        >
          <h1>Shopping Cart ({items.length})</h1>
        </Button>
      </div>
      
      {/* Cart Items */}
      <div className="p-4 space-y-4">
        {items.map((item) => (
          <Card key={item.product.id} className="overflow-hidden">
            <CardContent className="p-3">
              <div className="flex gap-3">
                <img 
                  src={item.product.image} 
                  alt={item.product.name} 
                  className="w-20 h-20 object-cover rounded-md"
                />
                
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium text-sm line-clamp-2">{item.product.name}</h3>
                    <button 
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-500 mt-1">{item.product.brand}</p>
                  
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center border rounded-md">
                      <button 
                        className="px-2 py-1 text-gray-500"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-2">{item.quantity}</span>
                      <button 
                        className="px-2 py-1 text-gray-500"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="font-bold text-brand-blue">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Promo Code */}
      <div className="px-4 mt-6">
        <div className="flex gap-2">
          <Input placeholder="Promo code" className="flex-1" />
          <Button variant="outline">Apply</Button>
        </div>
      </div>
      
      {/* Order Summary */}
      <div className="px-4 mt-6">
        <h2 className="font-bold mb-3">Order Summary</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${getTotalPrice().toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>$5.99</span>
          </div>
          <div className="flex justify-between">
            <span>Tax</span>
            <span>${(getTotalPrice() * 0.05).toFixed(2)}</span>
          </div>
        </div>
        <Separator className="my-3" />
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>${(getTotalPrice() + 5.99 + (getTotalPrice() * 0.05)).toFixed(2)}</span>
        </div>
      </div>
      
      {/* Checkout Button */}
      <div className="fixed bottom-16 left-0 right-0 p-4 bg-white border-t">
        <Button 
          className="w-full bg-brand-blue hover:bg-brand-blue/90"
          onClick={() => navigate('/checkout')}
        >
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
};

export default CartPage;
