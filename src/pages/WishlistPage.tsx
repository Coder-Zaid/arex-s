
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { ChevronLeft, Heart, ShoppingCart, Trash2 } from 'lucide-react';

const WishlistPage = () => {
  const navigate = useNavigate();
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  
  if (items.length === 0) {
    return (
      <div className="p-4 flex flex-col items-center justify-center h-[70vh]">
        <Heart size={64} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-bold mb-2">Your wishlist is empty</h2>
        <p className="text-gray-500 text-center mb-4">
          Save items you like to your wishlist and they'll show up here.
        </p>
        <Button onClick={() => navigate('/')}>Start Shopping</Button>
      </div>
    );
  }
  
  return (
    <div className="pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-sm p-3 flex items-center">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft />
        </Button>
        <h1 className="font-medium text-center flex-1 mr-8">My Wishlist ({items.length})</h1>
      </div>
      
      {/* Clear All Button */}
      <div className="p-4 flex justify-end">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gray-500"
          onClick={clearWishlist}
        >
          Clear All
        </Button>
      </div>
      
      {/* Wishlist Items */}
      <div className="p-4 space-y-4">
        {items.map((product) => (
          <Card 
            key={product.id} 
            className="overflow-hidden"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            <CardContent className="p-3">
              <div className="flex gap-3">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-20 h-20 object-cover rounded-md"
                />
                
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="font-medium text-sm line-clamp-2">{product.name}</h3>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromWishlist(product.id);
                      }}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-500 mt-1">{product.brand}</p>
                  
                  <div className="flex justify-between items-center mt-2">
                    <div className="font-bold text-brand-blue">
                      ${product.price.toFixed(2)}
                    </div>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 flex items-center gap-1 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                    >
                      <ShoppingCart size={14} />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
