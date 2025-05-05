
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { products } from '@/data/products';
import { Heart, ShoppingCart, Share2, ChevronLeft, ChevronRight, Star, Send } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { useAppSettings } from '@/context/AppSettingsContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';

// Sample reviews data
const sampleReviews = [
  {
    id: '1',
    userId: 'user1',
    userName: 'John Doe',
    rating: 5,
    comment: 'Excellent product! Really exceeded my expectations.',
    date: '2023-05-10',
    userImage: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Sarah Smith',
    rating: 4,
    comment: 'Great quality for the price. Would recommend.',
    date: '2023-04-22',
    userImage: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Michael Brown',
    rating: 3,
    comment: 'Good product, but shipping was a bit slow.',
    date: '2023-03-15',
    userImage: 'https://randomuser.me/api/portraits/men/62.jpg'
  }
];

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user, isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [bookingOpen, setBookingOpen] = useState(false);
  const { currencySymbol, convertPrice } = useAppSettings();
  const [activeTab, setActiveTab] = useState('description');
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [reviews, setReviews] = useState(sampleReviews);
  
  // Image gallery setup
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
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
  
  // Setup product images - main image + additional mock images
  const productImages = [
    product.image,
    // Add alternative images (mocked for demo)
    'https://picsum.photos/id/26/400/300',
    'https://picsum.photos/id/96/400/300'
  ];
  
  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };
  
  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  const handleImageThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };
  
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
      route: '/cart'
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
        route: '/cart'
      });
    }
  };

  const handleRatingChange = (rating: number) => {
    setNewReview(prev => ({ ...prev, rating }));
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.comment.trim()) {
      toast({
        title: "Error",
        description: "Please write a review comment",
        variant: "destructive"
      });
      return;
    }

    const userReview = {
      id: `review-${Date.now()}`,
      userId: user?.id || 'guest',
      userName: user?.name || 'Guest User',
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0],
      userImage: user?.photoURL || 'https://randomuser.me/api/portraits/lego/1.jpg'
    };

    setReviews([userReview, ...reviews]);
    setNewReview({ rating: 5, comment: '' });
    
    toast({
      title: "Review Submitted",
      description: "Thank you for your feedback!",
    });
  };
  
  // Apply currency conversion
  const convertedPrice = convertPrice(product.price);
  const convertedOldPrice = product.oldPrice ? convertPrice(product.oldPrice) : undefined;
  
  return (
    <div className="pb-24">
      {/* Back button */}
      <div className="sticky top-0 z-10 bg-background shadow-sm p-3 flex items-center">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ChevronLeft />
        </Button>
        <h1 className="font-medium text-center flex-1 mr-8">Product Details</h1>
      </div>
      
      {/* Product Image with gallery */}
      <div className="relative">
        <img 
          src={productImages[currentImageIndex]} 
          alt={product.name} 
          className="w-full h-64 object-cover"
        />
        
        {/* Image gallery navigation */}
        <Button 
          variant="outline" 
          size="icon" 
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-background/70 rounded-full"
          onClick={handlePrevImage}
        >
          <ChevronLeft size={18} />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-background/70 rounded-full"
          onClick={handleNextImage}
        >
          <ChevronRight size={18} />
        </Button>
        
        {/* Image indicator dots */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1">
          {productImages.map((_, index) => (
            <button
              key={index}
              onClick={() => handleImageThumbnailClick(index)}
              className={`w-2 h-2 rounded-full ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
        
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
      
      {/* Image thumbnails */}
      <div className="p-2 flex justify-center gap-2">
        {productImages.map((img, index) => (
          <img 
            key={index}
            src={img}
            alt={`Product thumbnail ${index + 1}`}
            className={`w-16 h-16 object-cover rounded-md cursor-pointer border-2 ${
              index === currentImageIndex ? 'border-brand-blue' : 'border-transparent'
            }`}
            onClick={() => handleImageThumbnailClick(index)}
          />
        ))}
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
                {currencySymbol}{convertedPrice.toFixed(2)}
              </span>
              {convertedOldPrice && (
                <span className="text-gray-400 line-through">
                  {currencySymbol}{convertedOldPrice.toFixed(2)}
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
          <Tabs defaultValue="description" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-4">
              <div>
                <p className="text-sm text-gray-600">{product.description}</p>
                
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
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-4">
              {/* Review submission form */}
              <Card className="mb-4 p-4">
                <h3 className="font-medium mb-2">Write a Review</h3>
                
                {!isAuthenticated ? (
                  <div className="text-sm text-gray-500 mb-2">
                    <p>Please <Button variant="link" className="p-0 h-auto text-brand-blue" onClick={() => navigate('/login')}>login</Button> to leave a review.</p>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit}>
                    <div className="mb-3">
                      <label className="block text-sm mb-1">Rating</label>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleRatingChange(star)}
                            className="focus:outline-none"
                          >
                            <Star 
                              size={24} 
                              className={`${newReview.rating >= star ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <label className="block text-sm mb-1">Comment</label>
                      <Textarea
                        placeholder="Share your experience with this product..."
                        value={newReview.comment}
                        onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                        className="w-full"
                        rows={3}
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">
                      Submit Review
                    </Button>
                  </form>
                )}
              </Card>
              
              {/* Reviews list */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No reviews yet. Be the first to review this product!</p>
                ) : (
                  reviews.map((review) => (
                    <Card key={review.id} className="p-3">
                      <div className="flex items-start gap-3">
                        <img 
                          src={review.userImage} 
                          alt={review.userName} 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">{review.userName}</h4>
                            <span className="text-xs text-gray-500">{review.date}</span>
                          </div>
                          
                          <div className="flex mt-1">
                            {[...Array(5)].map((_, i) => (
                              <span 
                                key={i} 
                                className={`text-sm ${
                                  i < review.rating 
                                    ? 'text-yellow-500' 
                                    : 'text-gray-300'
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          
                          <p className="text-sm mt-2">{review.comment}</p>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
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
      </div>
    </div>
  );
};

export default ProductDetailPage;
