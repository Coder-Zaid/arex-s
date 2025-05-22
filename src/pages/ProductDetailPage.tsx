import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useProducts } from '@/context/ProductContext';
import { 
  Heart, 
  ShoppingCart, 
  Share2, 
  ChevronLeft, 
  Star,
  MessageCircle,
  SendHorizontal 
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { useAppSettings } from '@/context/AppSettingsContext';
import RiyalSymbol from '@/components/ui/RiyalSymbol';

// Mock reviews data
const mockReviews = [
  {
    id: '1',
    userId: 'user1',
    userName: 'John Doe',
    rating: 5,
    text: 'Great product! Exactly what I was looking for.',
    date: '2023-04-15T10:30:00Z'
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Sarah Smith',
    rating: 4,
    text: 'Good quality, but shipping took longer than expected.',
    date: '2023-04-10T08:15:00Z'
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Michael Brown',
    rating: 5,
    text: 'Perfect! Would definitely recommend to others.',
    date: '2023-04-05T14:45:00Z'
  }
];

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { products } = useProducts();
  const { isAuthenticated } = useAuth();
  const { language, translations, currencySymbol } = useAppSettings();
  const t = translations[language];
  const [quantity, setQuantity] = useState(1);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [reviews, setReviews] = useState(mockReviews);
  
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Button onClick={() => navigate('/')}>Go back home</Button>
      </div>
    );
  }

  // Use product.images if available, otherwise fallback to [product.image]
  const productImages = product.images && product.images.length > 0 ? product.images : [product.image];
  
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

  const handleImageHover = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleSubmitReview = () => {
    if (!reviewText) {
      toast({
        title: "Error",
        description: "Please write your review first",
        variant: "destructive"
      });
      return;
    }
    
    // Create a new review
    const newReview = {
      id: `review-${Date.now()}`,
      userId: 'current-user',
      userName: 'You',
      rating: rating,
      text: reviewText,
      date: new Date().toISOString()
    };
    
    // Add the new review to the reviews list
    setReviews([newReview, ...reviews]);
    setReviewText('');
    setRating(5);
    setShowReviewForm(false);
    
    toast({
      title: "Review submitted",
      description: "Thank you for your feedback!"
    });
  };
  
  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
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
      
      {/* Product Image Gallery */}
      <div className="relative">
        {/* Main image */}
        <img 
          src={productImages[currentImageIndex]} 
          alt={product.name} 
          className="w-1/3 h-1/3 object-contain bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 dark:from-[#0a2240] dark:via-[#1e3a5c] dark:to-[#274472] rounded mx-auto transition-opacity duration-300"
        />
        
        {/* Image thumbnails */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {productImages.map((img, index) => (
            <div 
              key={index}
              className={`w-16 h-16 rounded-md overflow-hidden border-2 ${
                currentImageIndex === index ? 'border-brand-blue' : 'border-white/50'
              } cursor-pointer transition-all duration-200 hover:scale-110 bg-white`}
              onMouseEnter={() => handleImageHover(index)}
              onClick={() => setCurrentImageIndex(index)}
            >
              <img 
                src={img} 
                alt={`Product view ${index + 1}`} 
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-1">
          {product.onSale && (
            <Badge className="bg-brand-orange animate-pulse">Sale</Badge>
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
                {currencySymbol}
                {product.price.toFixed(2)}
              </span>
              {product.oldPrice && (
                <span className="text-gray-400 line-through">
                  {currencySymbol}
                  {product.oldPrice.toFixed(2)}
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
        
        {/* Tabs for Description and Reviews */}
        <div className="mt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-2">
              <TabsTrigger value="description" className="text-sm">Description</TabsTrigger>
              <TabsTrigger value="reviews" className="text-sm">Reviews ({reviews.length})</TabsTrigger>
              <TabsTrigger value="specs" className="text-sm">Specs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="animate-fade-in">
              <p className="text-sm text-gray-600">{product.description}</p>
            </TabsContent>
            
            <TabsContent value="reviews" className="animate-fade-in">
              <div className="mb-4">
                <hr className="my-4 border-gray-200" />
                <Button 
                  onClick={() => {
                    if (isAuthenticated) {
                      setShowReviewForm(true);
                    } else {
                      toast({
                        title: "Sign in required",
                        description: "Please sign in to write a review",
                      });
                      navigate('/login');
                    }
                  }} 
                  size="sm"
                  className="w-full mb-6 mt-2 border-2 border-brand-blue bg-white text-brand-blue font-bold shadow-md rounded-lg hover:bg-brand-blue hover:text-white transition-all duration-200"
                >
                  Write a Review
                </Button>
                
                {showReviewForm && (
                  <div className="bg-gray-50 p-3 rounded-lg mb-4 animate-scale-in">
                    <h3 className="font-medium text-sm mb-2">Your Review</h3>
                    <div className="flex items-center mb-2">
                      <span className="text-sm mr-2">Rating:</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="focus:outline-none"
                          >
                            <Star
                              size={20}
                              className={`${
                                star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
                              } cursor-pointer hover:scale-110 transition-all duration-100`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <Textarea
                      placeholder="Share your experience with this product..."
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      rows={3}
                      className="mb-2"
                    />
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={handleSubmitReview}
                        className="flex gap-1 items-center"
                      >
                        <SendHorizontal size={14} />
                        Submit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setShowReviewForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Reviews list */}
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <div className="text-center py-6 text-gray-500">
                      <MessageCircle className="mx-auto mb-2 h-10 w-10 opacity-20" />
                      <p>No reviews yet.</p>
                    </div>
                  ) : (
                    reviews.map((review) => (
                      <div key={review.id} className="border-b pb-3 last:border-b-0">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">{review.userName}</span>
                          <span className="text-xs text-gray-500">{formatDate(review.date)}</span>
                        </div>
                        <div className="flex mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={`${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-600">{review.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="specs" className="animate-fade-in">
              <Card className="p-3">
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
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Quantity Selector */}
        <div className="mt-6">
          <h2 className="font-medium mb-2">Quantity</h2>
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => quantity > 1 && setQuantity(quantity - 1)}
              className="hover:scale-105 active:scale-95 transition-transform duration-200"
            >
              -
            </Button>
            <span className="mx-4 w-8 text-center">{quantity}</span>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setQuantity(quantity + 1)}
              className="hover:scale-105 active:scale-95 transition-transform duration-200"
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
              } hover:scale-105 active:scale-95 transition-transform duration-200`}
              onClick={handleWishlistToggle}
            >
              <Heart 
                size={18} 
                className="mb-1 transition-transform duration-300 hover:scale-110"
                fill={isInWishlist(product.id) ? 'currentColor' : 'none'} 
              />
              <span className="text-xs">Wishlist</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col items-center py-2 px-0 h-auto hover:scale-105 active:scale-95 transition-transform duration-200"
              onClick={handleShare}
            >
              <Share2 size={18} className="mb-1" />
              <span className="text-xs">Share</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex flex-col items-center py-2 px-0 h-auto hover:scale-105 active:scale-95 transition-transform duration-200"
              onClick={handleBookNow}
            >
              <span className="text-xs">Book Now</span>
            </Button>
          </div>
          
          <Button 
            className="bg-brand-blue hover:bg-brand-blue/90 flex gap-2 items-center hover:scale-[1.01] active:scale-[0.99] transition-transform duration-200"
            onClick={handleAddToCart}
          >
            <ShoppingCart size={16} />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
