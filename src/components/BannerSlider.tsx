
import React from 'react';
import { Link } from 'react-router-dom';
import { Banner } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

interface BannerSliderProps {
  banners: Banner[];
}

const BannerSlider = ({ banners }: BannerSliderProps) => {
  return (
    <div className="overflow-x-auto flex gap-4 pb-2 no-scrollbar">
      {banners.map((banner) => (
        <Link 
          to={banner.link} 
          key={banner.id} 
          className="min-w-[85%] flex-shrink-0 first:ml-4 last:mr-4"
        >
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="relative">
                <img 
                  src={banner.image} 
                  alt={banner.title} 
                  className="w-full h-32 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <h3 className="text-white font-bold text-lg">{banner.title}</h3>
                  <p className="text-white/90 text-sm">{banner.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default BannerSlider;
