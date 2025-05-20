import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Heart, ShoppingCart } from 'lucide-react';
import { useAppSettings } from '@/context/AppSettingsContext';
import RiyalSymbol from '@/components/ui/RiyalSymbol';
import { useTheme } from '@/context/ThemeContext';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { currencySymbol, language, convertPrice } = useAppSettings();
  const { theme } = useTheme();
  const [currentImage, setCurrentImage] = useState(0);
  const images = product.images && product.images.length > 0 && product.images[0] ? product.images : [product.image];
  const placeholder = '/placeholder.svg';
  
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = placeholder;
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
  
  // Convert product price based on current currency
  const displayPrice = convertPrice(product.price, 'SAR');
  const displayOldPrice = product.oldPrice ? convertPrice(product.oldPrice, 'SAR') : null;
  
  // Display rating as stars
  const renderRatingStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span 
            key={star} 
            className={`text-xs ${
              star <= Math.floor(rating) 
                ? 'text-yellow-500' 
                : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
        <span className="text-xs text-gray-500 ml-1">
          {language === 'ar' ? 
            `(${rating.toString().replace(/\d/g, (d) => String.fromCharCode(1632 + parseInt(d)))})` :
            `(${rating})`}
        </span>
      </div>
    );
  };
  
  return (
    <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-md bg-transparent">
      <Link to={`/product/${product.id}`}>
        <div className="relative">
          {/* Image Carousel */}
          <div className="flex justify-center items-center w-full h-32 bg-white">
            <Zoom>
              <img 
                src={images[currentImage] || placeholder} 
                alt={product.name} 
                className="object-contain"
                style={{ width: '70%', height: '70%', maxWidth: '100%', maxHeight: '100%', margin: 'auto', display: 'block', cursor: 'zoom-in' }}
                onError={handleImageError}
              />
            </Zoom>
          </div>
          {images.length > 1 && (
            <>
              <button
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow hover:bg-white z-10"
                onClick={handlePrev}
                aria-label="Previous image"
              >
                &#8592;
              </button>
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow hover:bg-white z-10"
                onClick={handleNext}
                aria-label="Next image"
              >
                &#8594;
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {images.map((_, idx) => (
                  <span
                    key={idx}
                    className={`inline-block w-2 h-2 rounded-full ${idx === currentImage ? 'bg-brand-blue' : 'bg-gray-300'}`}
                  />
                ))}
              </div>
            </>
          )}
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.onSale && (
              <Badge className="bg-brand-orange">
                {language === 'ar' ? 'تخفيض' : 'Sale'}
              </Badge>
            )}
            {product.isNew && (
              <Badge className="bg-green-500">
                {language === 'ar' ? 'جديد' : 'New'}
              </Badge>
            )}
          </div>
          
          {/* Wishlist Button */}
          <Button
            size="icon"
            variant="ghost"
            className={`absolute top-2 right-2 rounded-full ${
              isInWishlist(product.id) ? 'text-red-500' : 'text-gray-500'
            }`}
            onClick={handleWishlistToggle}
          >
            <Heart 
              fill={isInWishlist(product.id) ? 'currentColor' : 'none'} 
              size={18} 
            />
          </Button>
        </div>
        
        <CardContent className="p-3 bg-transparent">
          <div className="flex flex-col gap-2">
            <h3 className="font-medium line-clamp-2 text-sm text-foreground">{product.name}</h3>
            
            <div className="flex items-baseline gap-2">
              <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}> 
                {formatNumber(displayPrice)}{currencySymbol === 'ر.س' ? ' SAR' : currencySymbol}
              </span>
              {displayOldPrice && (
                <span className={`text-red-500 line-through text-xs ${theme === 'dark' ? 'text-red-400' : ''}`}> 
                  {formatNumber(displayOldPrice)}{currencySymbol === 'ر.س' ? ' SAR' : currencySymbol}
                </span>
              )}
            </div>
            
            <div className="flex justify-between items-center mt-2">
              {/* Stars Rating instead of brand */}
              {renderRatingStars(product.rating)}
              
              <Button
                size="sm"
                variant="ghost"
                className="p-1 h-8 flex items-center gap-1 text-xs"
                onClick={handleAddToCart}
              >
                <ShoppingCart size={14} />
                {language === 'ar' ? 'أضف' : 'Add'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ProductCard;
