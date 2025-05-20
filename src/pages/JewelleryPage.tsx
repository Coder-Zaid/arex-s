import React from 'react';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { TopNavBar } from '@/components/layout/TopNavBar';

const JewelleryPage = () => {
  return (
    <ResponsiveLayout>
      <TopNavBar />
      <div className="max-w-3xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Jewellery</h1>
        <p className="text-gray-600">Browse and buy beautiful jewellery here. (Product listing coming soon!)</p>
      </div>
    </ResponsiveLayout>
  );
};

export default JewelleryPage; 