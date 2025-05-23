import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const SettingsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-brand-blue pb-24 px-4 text-black">
      <div className="flex items-center gap-2 pt-6 mb-6">
        <Button variant="ghost" size="icon" className="text-black" onClick={() => navigate('/profile')}>
          <ChevronLeft />
        </Button>
        <h1 className="text-2xl font-bold ml-2 text-black">Settings</h1>
      </div>
      <div className="max-w-md mx-auto">
        <Card className="bg-white/90 shadow-lg border-0 text-black">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="text-black/80">(Demo: Add your settings here)</div>
              <Button className="w-full bg-brand-blue text-white mt-4">Save Settings</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage; 