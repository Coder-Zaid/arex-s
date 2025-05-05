import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  ShoppingCart, 
  Truck,
  Sparkles,
  Star,
  Check,
  AlarmClock,
  Package
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { products } from '@/data/products';
import { Product, Review } from '@/types';
import { useAppSettings } from '@/context/AppSettingsContext';
import { useAuth } from '@/context/AuthContext';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const { language, currencySymbol, convertPrice } = useAppSettings();
  
  // Find the product based on the ID from the URL
  const product = products.find(p => p.id === id);
  
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  
  // Mock additional product images
  const productImages = [
    product?.image,
    '/placeholder.svg',
    '/placeholder.svg',
    '/placeholder.svg'
  ];
  
  // Mock reviews
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      productId: id || '1',
      userId: 'user1',
      userName: 'John D.',
      rating: 5,
      comment: 'Excellent product! Exactly as described and arrived quickly.',
      date: '2023-05-15',
      verified: true
    },
    {
      id: '2',
      productId: id || '1',
      userId: 'user2',
      userName: 'Sarah M.',
      rating: 4,
      comment: 'Good quality for the price. Would recommend.',
      date: '2023-05-10',
      verified: true
    }
  ]);
  
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });
  
  if (!product) {
    return (
      <div className="p-4">
        <p className="text-center">Product not found</p>
      </div>
    );
  }
  
  const handleAddToCart = () => {
    // Create a new object that combines the product with the quantity
    addToCart({...product, quantity});
  };
  
  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };
  
  const handleSubmitReview = () => {
    if (!user || !newReview.comment) return;
    
    const review: Review = {
      id: `new-${Date.now()}`,
      productId: id || '1',
      userId: user.id,
      userName: user.name,
      userPhoto: user.photoURL,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0],
      verified: true
    };
    
    setReviews([review, ...reviews]);
    setNewReview({
      rating: 5,
      comment: ''
    });
  };
  
  // Display stock status
  const renderStockStatus = () => {
    if (!product.inStock) {
      return (
        <div className="flex items-center mt-2">
          <span className="bg-red-100 text-red-500 px-2 py-1 rounded text-sm font-medium flex items-center">
            <Package size={14} className="mr-1" /> 
            {language === 'ar' ? 'نفذ من المخزون' : 'Out of Stock'}
          </span>
        </div>
      );
    }
    
    if (product.inventory !== undefined) {
      if (product.inventory < 10) {
        return (
          <div className="flex items-center mt-2">
            <span className="bg-amber-100 text-amber-600 px-2 py-1 rounded text-sm font-medium flex items-center">
              <AlarmClock size={14} className="mr-1" /> 
              {language === 'ar' ? `مخزون منخفض (${product.inventory} متبقي)` : `Low Stock (${product.inventory} remaining)`}
            </span>
          </div>
        );
      }
      return (
        <div className="flex items-center mt-2">
          <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-sm font-medium flex items-center">
            <Check size={14} className="mr-1" /> 
            {language === 'ar' ? 'متوفر' : 'In Stock'}
          </span>
        </div>
      );
    }
    
    return null;
  };
  
  // Convert price based on selected currency
  const convertedPrice = convertPrice(product.price);
  const convertedOldPrice = product.oldPrice ? convertPrice(product.oldPrice) : null;
  
  // Calculate average rating
  const avgRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  
  return (
    <div className="pb-20">
      {/* Product Info */}
      <div className="p-4">
        {/* Product Image Gallery */}
        <div className="mb-6">
          <div className="mb-2 rounded-lg overflow-hidden bg-gray-100">
            <img
              src={productImages[activeImage]}
              alt={product.name}
              className="w-full h-64 object-contain"
            />
          </div>
          <div className="flex space-x-2 overflow-x-auto">
            {productImages.map((img, index) => (
              <div
                key={index}
                className={`w-16 h-16 flex-shrink-0 rounded border-2 overflow-hidden
                  ${activeImage === index ? 'border-blue-500' : 'border-transparent'}
                `}
                onClick={() => setActiveImage(index)}
              >
                <img
                  src={img}
                  alt={`${product.name} thumbnail ${index}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between">
            <div>
              {product.onSale && (
                <Badge className="bg-brand-orange mb-2">
                  {language === 'ar' ? 'تخفيض' : 'SALE'}
                </Badge>
              )}
              {product.isNew && (
                <Badge className="bg-green-500 ml-2 mb-2">
                  {language === 'ar' ? 'جديد' : 'NEW'}
                </Badge>
              )}
            </div>
            <Button
              variant="outline"
              size="icon"
              className={isInWishlist(product.id) ? 'text-red-500' : ''}
              onClick={handleWishlistToggle}
            >
              <Heart
                className="h-4 w-4"
                fill={isInWishlist(product.id) ? 'currentColor' : 'none'}
              />
            </Button>
          </div>
          
          <h1 className="text-xl font-bold mb-1">{product.name}</h1>
          
          <div className="flex items-center mb-2">
            <div className="flex mr-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= avgRating
                      ? 'text-yellow-500 fill-yellow-500'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              ({reviews.length} {language === 'ar' ? 'تقييمات' : 'reviews'})
            </span>
          </div>
          
          <div className="flex items-baseline">
            <p className="text-2xl font-bold">{currencySymbol}{convertedPrice.toFixed(2)}</p>
            {convertedOldPrice && (
              <p className="ml-2 text-muted-foreground line-through">
                {currencySymbol}{convertedOldPrice.toFixed(2)}
              </p>
            )}
          </div>
          
          {/* Stock Status */}
          {renderStockStatus()}
          
          {/* Seller Info (if available) */}
          {product.sellerId && (
            <div className="mt-4 text-sm">
              <p className="text-muted-foreground">
                {language === 'ar' ? 'البائع' : 'Seller'}: <span className="font-medium text-foreground">Store Name</span>
              </p>
            </div>
          )}
          
          {/* Add to Cart Section */}
          <div className="mt-6 flex items-center">
            <div className="flex-shrink-0 w-24 mr-2">
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                disabled={!product.inStock}
                className="text-center"
              />
            </div>
            <Button 
              className="flex-1 flex items-center justify-center" 
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {language === 'ar' ? 'أضف إلى السلة' : 'Add to Cart'}
            </Button>
          </div>
          
          {/* Shipping Info */}
          <div className="mt-6 p-3 bg-muted rounded-lg">
            <div className="flex items-start">
              <Truck className="h-5 w-5 mt-0.5 mr-2 text-muted-foreground" />
              <div>
                <p className="font-medium">
                  {language === 'ar' ? 'شحن مجاني' : 'Free Shipping'}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'للطلبات التي تزيد عن 100' : 'For orders over 100'} {currencySymbol}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Product Details Tab */}
        <Tabs defaultValue="description" className="mt-6">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="description">
              {language === 'ar' ? 'الوصف' : 'Description'}
            </TabsTrigger>
            <TabsTrigger value="specifications">
              {language === 'ar' ? 'المواصفات' : 'Specifications'}
            </TabsTrigger>
            <TabsTrigger value="reviews">
              {language === 'ar' ? 'التقييمات' : 'Reviews'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="pt-4">
            <p>{product.description}</p>
            
            <div className="mt-4">
              <h3 className="font-medium mb-2">
                {language === 'ar' ? 'الميزات' : 'Features'}
              </h3>
              <ul className="space-y-2">
                {[1, 2, 3].map(i => (
                  <li key={i} className="flex items-start">
                    <Sparkles className="h-5 w-5 mr-2 text-brand-blue flex-shrink-0 mt-0.5" />
                    <span>Feature {i} description goes here</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="specifications" className="pt-4">
            <div className="space-y-3">
              <div className="flex py-2 border-b">
                <span className="font-medium w-1/3">Brand</span>
                <span className="w-2/3">{product.brand}</span>
              </div>
              <div className="flex py-2 border-b">
                <span className="font-medium w-1/3">Category</span>
                <span className="w-2/3">{product.category}</span>
              </div>
              <div className="flex py-2 border-b">
                <span className="font-medium w-1/3">Availability</span>
                <span className="w-2/3">
                  {!product.inStock 
                    ? (language === 'ar' ? 'نفذ من المخزون' : 'Out of Stock') 
                    : (language === 'ar' ? 'متوفر' : 'In Stock')}
                </span>
              </div>
              <div className="flex py-2 border-b">
                <span className="font-medium w-1/3">Weight</span>
                <span className="w-2/3">0.5 kg</span>
              </div>
              <div className="flex py-2">
                <span className="font-medium w-1/3">Warranty</span>
                <span className="w-2/3">1 year</span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="reviews" className="pt-4">
            {/* Add a review form */}
            {user && (
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-4">
                    {language === 'ar' ? 'أضف تقييمك' : 'Add Your Review'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {language === 'ar' ? 'التقييم' : 'Rating'}
                      </label>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-6 w-6 cursor-pointer ${
                              star <= newReview.rating
                                ? 'text-yellow-500 fill-yellow-500'
                                : 'text-gray-300'
                            }`}
                            onClick={() => setNewReview({...newReview, rating: star})}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {language === 'ar' ? 'تعليقك' : 'Your Review'}
                      </label>
                      <Textarea
                        value={newReview.comment}
                        onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                        placeholder={language === 'ar' ? 'اكتب تعليقك هنا...' : 'Write your review here...'}
                        className="min-h-[100px]"
                      />
                    </div>
                    <Button onClick={handleSubmitReview}>
                      {language === 'ar' ? 'إرسال التقييم' : 'Submit Review'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Reviews list */}
            <div className="space-y-4">
              <h3 className="font-medium">
                {reviews.length} {language === 'ar' ? 'تقييمات' : 'Reviews'}
              </h3>
              
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-4">
                  <div className="flex items-center mb-2">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={review.userPhoto} />
                      <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium mr-2">{review.userName}</span>
                        {review.verified && (
                          <Badge variant="outline" className="text-xs">
                            <Check className="h-3 w-3 mr-1" /> Verified
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">{review.date}</div>
                    </div>
                  </div>
                  <div className="flex mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm">{review.comment}</p>
                </div>
              ))}
              
              {reviews.length === 0 && (
                <p className="text-center text-muted-foreground py-6">
                  {language === 'ar' ? 'لا توجد تقييمات بعد' : 'No reviews yet'}
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProductDetailPage;
