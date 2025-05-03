
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { products } from '@/data/products';
import { Heart, ShoppingCart, Share2, ChevronLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [bookingOpen, setBookingOpen] = useState(false);
  
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return (
      <div className="p-4 flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-xl font-bold mb-2">Product not found</h2>
        <p className="text-gray-500 mb-4">The product you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    );
  }
  
  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };
  
  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBookNow = () => {
    setBookingOpen(true);
    toast({
      title: "Product Booked",
      description: `You've successfully booked ${product.name}. We'll hold it for you!`,
    });
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Product link copied to clipboard",
      });
    }
  };
  
  return (
    <div className="pb-24">
      {/* Back button */}
      <div className="sticky top-0 z-10 bg-white shadow-sm p-3 flex items-center">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft />
        </Button>
        <h1 className="font-medium text-center flex-1 mr-8">Product Details</h1>
      </div>
      
      {/* Product Image */}
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-64 object-cover"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-1">
          {product.onSale && (
            <Badge className="bg-brand-orange">Sale</Badge>
          )}
          {product.isNew && (
            <Badge className="bg-green-500">New</Badge>
          )}
        </div>
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold">{product.name}</h1>
            <p className="text-gray-500">{product.brand}</p>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-xl text-brand-blue">
                ${product.price.toFixed(2)}
              </span>
              {product.oldPrice && (
                <span className="text-gray-400 line-through">
                  ${product.oldPrice.toFixed(2)}
                </span>
              )}
            </div>
            <div className="flex items-center mt-1">
              {/* Star rating */}
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span 
                    key={i} 
                    className={`text-sm ${
                      i < Math.floor(product.rating) 
                        ? 'text-yellow-500' 
                        : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-1">{product.rating}</span>
            </div>
          </div>
        </div>
        
        {/* Description */}
        <div className="mt-4">
          <h2 className="font-medium mb-2">Description</h2>
          <p className="text-sm text-gray-600">{product.description}</p>
        </div>
        
        {/* Quantity Selector */}
        <div className="mt-6">
          <h2 className="font-medium mb-2">Quantity</h2>
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => quantity > 1 && setQuantity(quantity - 1)}
            >
              -
            </Button>
            <span className="mx-4 w-8 text-center">{quantity}</span>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </Button>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-3">
            <Button 
              variant="outline" 
              className={`flex flex-col items-center py-2 px-0 h-auto ${
                isInWishlist(product.id) ? 'text-red-500' : ''
              }`}
              onClick={handleWishlistToggle}
            >
              <Heart 
                size={18} 
                className="mb-1"
                fill={isInWishlist(product.id) ? 'currentColor' : 'none'} 
              />
              <span className="text-xs">Wishlist</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col items-center py-2 px-0 h-auto"
              onClick={handleShare}
            >
              <Share2 size={18} className="mb-1" />
              <span className="text-xs">Share</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col items-center py-2 px-0 h-auto"
              onClick={handleBookNow}
            >
              <span className="text-xs">Book Now</span>
            </Button>
          </div>
          
          <Button 
            className="bg-brand-blue hover:bg-brand-blue/90 flex gap-2 items-center"
            onClick={handleAddToCart}
          >
            <ShoppingCart size={16} />
            Add to Cart
          </Button>
        </div>
        
        {/* Specs */}
        <Card className="mt-6 p-3">
          <h2 className="font-medium mb-2">Specifications</h2>
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Brand</span>
              <span>{product.brand}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Category</span>
              <span>{product.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Availability</span>
              <span>{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetailPage;
