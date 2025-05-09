import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const PaymentMethodsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-brand-blue via-purple-700 to-red-500 pb-24 px-4 text-white">
      <div className="flex items-center gap-2 pt-6 mb-6">
        <Button variant="ghost" size="icon" className="text-white" onClick={() => navigate('/profile')}>
          <ChevronLeft />
        </Button>
        <h1 className="text-2xl font-bold ml-2">Payment Methods</h1>
      </div>
      <div className="max-w-md mx-auto">
        <Card className="bg-white/10 shadow-lg border-0 text-white">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="text-white/80">(Demo: Add your payment methods here)</div>
              <Button className="w-full bg-brand-blue text-white mt-4">Add Payment Method</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentMethodsPage; 