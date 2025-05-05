
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Heart, ShoppingCart } from 'lucide-react';
import { useAppSettings } from '@/context/AppSettingsContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { currencySymbol, language, convertPrice } = useAppSettings();
  
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

  // Format number based on language
  const formatNumber = (num: number) => {
    if (language === 'ar') {
      // Convert to Arabic numerals
      return num.toFixed(2).replace(/\d/g, (d) => 
        String.fromCharCode(1632 + parseInt(d)));
    }
    return num.toFixed(2);
  };
  
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
  
  // Apply currency conversion
  const convertedPrice = convertPrice(product.price);
  const convertedOldPrice = product.oldPrice ? convertPrice(product.oldPrice) : undefined;
  
  return (
    <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-md">
      <Link to={`/product/${product.id}`}>
        <div className="relative">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-40 object-cover"
          />
          
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
        
        <CardContent className="p-3">
          <div className="flex flex-col gap-2">
            <h3 className="font-medium line-clamp-2 text-sm text-foreground">{product.name}</h3>
            
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-brand-blue">
                {currencySymbol}{formatNumber(convertedPrice)}
              </span>
              {convertedOldPrice && (
                <span className="text-gray-400 line-through text-xs">
                  {currencySymbol}{formatNumber(convertedOldPrice)}
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
