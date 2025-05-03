
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Heart, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
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
              <Badge className="bg-brand-orange">Sale</Badge>
            )}
            {product.isNew && (
              <Badge className="bg-green-500">New</Badge>
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
            <h3 className="font-medium line-clamp-2 text-sm">{product.name}</h3>
            
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-brand-blue">${product.price.toFixed(2)}</span>
              {product.oldPrice && (
                <span className="text-gray-400 line-through text-xs">${product.oldPrice.toFixed(2)}</span>
              )}
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <div className="text-xs text-gray-500">{product.brand}</div>
              
              <Button
                size="sm"
                variant="ghost"
                className="p-1 h-8 flex items-center gap-1 text-xs"
                onClick={handleAddToCart}
              >
                <ShoppingCart size={14} />
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ProductCard;
