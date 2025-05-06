
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Store, 
  Upload, 
  Image, 
  CheckCircle, 
  Package, 
  Truck, 
  DollarSign, 
  Tag, 
  ListChecks, 
  FileText, 
  Plus,
  Check,
  X,
  Clock,
  Mail,
  UserX,
  Loader2,
  Shield
} from 'lucide-react';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Product, User } from '@/types';
import { useAppSettings } from '@/context/AppSettingsContext';

const productSchema = z.object({
  name: z.string().min(3, { message: "Product name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  price: z.coerce.number().positive({ message: "Price must be positive" }),
  inventory: z.coerce.number().int().positive({ message: "Inventory must be a positive integer" }),
  category: z.string().min(1, { message: "Category is required" }),
  brand: z.string().min(1, { message: "Brand is required" }),
});

type ProductFormValues = z.infer<typeof productSchema>;

const SellerPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, requestSellerAccount, approveSellerRequest, rejectSellerRequest, pendingSellerRequests } = useAuth();
  const { toast } = useToast();
  const [storeName, setStoreName] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('register');
  const [productImages, setProductImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [specifications, setSpecifications] = useState<{ key: string; value: string }[]>([
    { key: '', value: '' }
  ]);
  const [isVendorArexOriginal, setIsVendorArexOriginal] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const { currencySymbol } = useAppSettings();

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      inventory: 1,
      category: '',
      brand: '',
    },
  });

  // Check if user is an admin (for approving seller requests)
  const isAdmin = user?.sellerApproved && user?.isSeller;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (isAdmin) {
      // Set admin to requests tab by default
      setActiveTab('requests');
    } else if (user?.isSeller && user?.sellerApproved) {
      setActiveTab('dashboard');
    } else {
      // Default to registration tab for new sellers
      setActiveTab('register');
    }
    
    // Simulate loading products if user is authenticated
    if (isAuthenticated && user?.isSeller && user?.sellerApproved) {
      if (activeTab === 'products' || activeTab === 'orders') {
        setTimeout(() => {
          const mockProducts = [
            {
              id: "seller-1",
              name: "Professional DSLR Camera",
              description: "High-quality professional camera with 24MP sensor",
              price: 1299.99,
              image: "/placeholder.svg",
              category: "Cameras",
              brand: "PhotoPro",
              rating: 4.8,
              inStock: true,
              sellerId: user?.id,
              inventory: 5
            },
            {
              id: "seller-2",
              name: "Wireless Earbuds",
              description: "True wireless earbuds with noise cancellation",
              price: 149.99,
              image: "/placeholder.svg",
              category: "Audio",
              brand: "SoundMaster",
              rating: 4.5,
              inStock: true,
              sellerId: user?.id,
              inventory: 20
            }
          ];
          setProducts(mockProducts);
          
          const mockOrders = [
            {
              id: "order-1",
              productId: "seller-1",
              productName: "Professional DSLR Camera",
              customer: "John Smith",
              status: "pending",
              date: "2023-05-01",
              delivered: false
            },
            {
              id: "order-2",
              productId: "seller-2",
              productName: "Wireless Earbuds",
              customer: "Emily Johnson",
              status: "processing",
              date: "2023-05-03",
              delivered: false
            }
          ];
          setOrders(mockOrders);
        }, 500);
      }
    }
  }, [isAuthenticated, navigate, activeTab, user?.id, user?.isSeller, user?.sellerApproved, isAdmin]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleProductImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setProductImages([...productImages, ...files]);
      
      const newImageUrls = files.map(file => URL.createObjectURL(file));
      setImagePreviewUrls([...imagePreviewUrls, ...newImageUrls]);
    }
  };

  const removeProductImage = (index: number) => {
    const newImages = [...productImages];
    newImages.splice(index, 1);
    setProductImages(newImages);
    
    const newImageUrls = [...imagePreviewUrls];
    URL.revokeObjectURL(newImageUrls[index]);
    newImageUrls.splice(index, 1);
    setImagePreviewUrls(newImageUrls);
  };

  const addSpecification = () => {
    setSpecifications([...specifications, { key: '', value: '' }]);
  };

  const updateSpecification = (index: number, key: string, value: string) => {
    const newSpecs = [...specifications];
    newSpecs[index] = { key, value };
    setSpecifications(newSpecs);
  };

  const removeSpecification = (index: number) => {
    if (specifications.length > 1) {
      const newSpecs = [...specifications];
      newSpecs.splice(index, 1);
      setSpecifications(newSpecs);
    }
  };

  const handleStoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Submit seller request
    requestSellerAccount(storeName, storeDescription, logoFile || undefined)
      .then(() => {
        setIsSubmitting(false);
        // Switch to verification tab after registration
        setActiveTab('verification');
        
        // Generate a random verification code (in a real app, this would be sent via email)
        const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
        console.log('Verification code:', randomCode); // For demo purposes only
        localStorage.setItem('verificationCode', randomCode);
        
        toast({
          title: "Verification email sent",
          description: `Please check your email at ${user?.email} for the verification code. (For demo: ${randomCode})`,
        });
      })
      .catch(() => {
        setIsSubmitting(false);
      });
  };

  const handleVerifyEmail = () => {
    setVerifyingEmail(true);
    
    // Simulate API verification delay
    setTimeout(() => {
      const storedCode = localStorage.getItem('verificationCode');
      
      if (verificationCode === storedCode) {
        // Update user's verification status
        setEmailVerified(true);
        
        toast({
          title: "Email verified",
          description: "Your email has been verified successfully. Your account is now pending approval from an administrator.",
        });
        
        setActiveTab('pending');
      } else {
        toast({
          title: "Verification failed",
          description: "The verification code is incorrect. Please try again.",
          variant: "destructive"
        });
      }
      
      setVerifyingEmail(false);
    }, 1000);
  };
  
  const handleApproveSeller = (sellerId: string) => {
    approveSellerRequest(sellerId)
      .then(() => {
        toast({
          title: "Seller approved",
          description: "The seller account has been approved successfully.",
        });
      });
  };
  
  const handleRejectSeller = (sellerId: string) => {
    rejectSellerRequest(sellerId)
      .then(() => {
        toast({
          title: "Seller rejected",
          description: "The seller account request has been rejected.",
        });
      });
  };
  
  const onProductSubmit = (data: ProductFormValues) => {
    if (!user?.isSeller || !user?.sellerApproved) {
      toast({
        title: "Permission denied",
        description: "You need to be an approved seller to add products",
        variant: "destructive"
      });
      return;
    }
    
    if (productImages.length === 0) {
      toast({
        title: "Error",
        description: "Please upload at least one product image",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      const newProduct: Product = {
        id: `seller-${Date.now()}`,
        ...data,
        image: URL.createObjectURL(productImages[0]),
        rating: 0,
        inStock: true,
        sellerId: user?.id || '',
        images: imagePreviewUrls,
        // Make sure all required fields have values
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        brand: data.brand
      };
      
      setProducts([newProduct, ...products]);
      
      toast({
        title: "Product Added",
        description: "Your product has been successfully listed for sale",
      });
      
      // Reset form
      form.reset();
      setProductImages([]);
      setImagePreviewUrls([]);
      setSpecifications([{ key: '', value: '' }]);
      
      setActiveTab('products');
    }, 1000);
  };

  const confirmDelivery = (orderId: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? {...order, status: 'shipped', delivered: true} : order
    ));
    
    toast({
      title: "Delivery Confirmed",
      description: "The order has been marked as out for delivery",
    });
    
    setSelectedOrderId(null);
  };
  
  const calculateCommission = (price: number) => {
    if (isVendorArexOriginal) {
      return 0;
    }
    return price * 0.05; // 5% commission
  };

  // Content for different seller states
  const renderSellerContent = () => {
    // If user is seller but not approved
    if (user?.storeDetails && !user?.sellerApproved) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock size={18} className="text-yellow-500" />
              Seller Account Pending Approval
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock size={32} className="text-yellow-500" />
            </div>
            <h3 className="text-lg font-medium mb-2">Your seller application is under review</h3>
            <p className="text-gray-500 mb-4">Thank you for registering as a seller. Your application is currently being reviewed by our team.</p>
            <p className="text-sm text-gray-400">Store name: {user.storeDetails.name}</p>
            <p className="text-sm text-gray-400">Submitted on: {new Date(user.sellerRequestDate || '').toLocaleDateString()}</p>
          </CardContent>
        </Card>
      );
    }
    
    // If user is approved seller
    if (user?.isSeller && user?.sellerApproved) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle size={18} className="text-green-500" />
              Seller Account Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">{user.storeDetails?.name}</p>
            <p className="text-gray-500 mb-4">{user.storeDetails?.description}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold">{products.length}</p>
                <p className="text-sm text-gray-500">Products</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold">{orders.length}</p>
                <p className="text-sm text-gray-500">Orders</p>
              </div>
            </div>
            
            <Button 
              className="w-full mb-2"
              onClick={() => setActiveTab('products')}
            >
              Manage Products
            </Button>
            <Button 
              variant="outline"
              className="w-full"
              onClick={() => setActiveTab('orders')}
            >
              View Orders
            </Button>
          </CardContent>
        </Card>
      );
    }
    
    // Default - not a seller yet
    return (
      <div className="text-center py-10">
        <Store size={48} className="mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium mb-2">You're not registered as a seller yet</h3>
        <p className="text-gray-500 mb-4">Register to start selling your products</p>
        <Button onClick={() => setActiveTab('register')}>Register Now</Button>
      </div>
    );
  };
  
  // Define tabs for different user types
  const renderTabs = () => {
    // For admins
    if (isAdmin) {
      return (
        <TabsList className="grid w-full grid-cols-5 mb-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="requests">
            Approve Sellers
            {pendingSellerRequests.length > 0 && (
              <span className="ml-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 inline-flex items-center justify-center">
                {pendingSellerRequests.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
      );
    }
    
    // For approved sellers
    if (user?.isSeller && user?.sellerApproved) {
      return (
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
      );
    }
    
    // For pending sellers or new users
    return (
      <TabsList className="grid w-full grid-cols-3 mb-4">
        <TabsTrigger value="register">Register</TabsTrigger>
        <TabsTrigger value="verification">Verify Email</TabsTrigger>
        <TabsTrigger value="pending">Status</TabsTrigger>
      </TabsList>
    );
  };
  
  return (
    <div className="pb-20 pt-4 px-4">
      <h1 className="text-2xl font-bold mb-4">Seller Center</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {renderTabs()}
        
        <TabsContent value="register" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store size={18} />
                Become a Seller
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!user?.storeDetails ? (
                <form onSubmit={handleStoreSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="store-name">Store Name</Label>
                    <Input 
                      id="store-name"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      placeholder="Your store name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="store-description">Store Description</Label>
                    <Textarea 
                      id="store-description"
                      value={storeDescription}
                      onChange={(e) => setStoreDescription(e.target.value)}
                      placeholder="Tell customers about your store"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 mb-2">
                      <Switch
                        id="arex-switch"
                        checked={isVendorArexOriginal}
                        onCheckedChange={setIsVendorArexOriginal}
                      />
                      <Label htmlFor="arex-switch" className="font-medium">I am an AREXORIGINAL vendor</Label>
                    </div>
                    {isVendorArexOriginal ? (
                      <p className="text-sm text-green-600">As an AREXORIGINAL vendor, you are exempt from the 5% commission fee.</p>
                    ) : (
                      <p className="text-sm text-gray-500">Standard 5% commission applies to all sales.</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="store-logo">Store Logo</Label>
                    <div className="flex items-center gap-4">
                      <div className="border border-gray-200 rounded-lg w-24 h-24 flex items-center justify-center overflow-hidden bg-gray-50">
                        {logoFile ? (
                          <img 
                            src={URL.createObjectURL(logoFile)} 
                            alt="Store logo preview" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Image size={32} className="text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <Input
                          id="store-logo"
                          type="file"
                          onChange={handleLogoChange}
                          accept="image/*"
                          className="hidden"
                        />
                        <Label 
                          htmlFor="store-logo"
                          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md cursor-pointer w-fit"
                        >
                          <Upload size={16} />
                          Choose Image
                        </Label>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-brand-blue hover:bg-brand-blue/90 mt-4"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Register as Seller'}
                  </Button>

                  <div className="text-xs text-gray-500 border-t pt-4 mt-4">
                    <p className="mb-2">By registering as a seller, you agree to our terms and conditions:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>You must verify your email address</li>
                      <li>Your seller account will be reviewed by our team</li>
                      <li>You can only sell products once your account is approved</li>
                      <li>5% commission applies to all sales (exempt for AREXORIGINAL vendors)</li>
                    </ul>
                  </div>
                </form>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle size={48} className="mx-auto mb-4 text-green-500" />
                  <h3 className="text-lg font-medium mb-2">Registration Submitted</h3>
                  <p className="text-gray-500 mb-4">Your seller registration has been submitted.</p>
                  <Button onClick={() => setActiveTab('verification')}>Continue to Verification</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail size={18} />
                Email Verification
              </CardTitle>
            </CardHeader>
            <CardContent>
              {emailVerified ? (
                <div className="text-center py-8">
                  <CheckCircle size={48} className="mx-auto mb-4 text-green-500" />
                  <h3 className="text-lg font-medium mb-2">Email Verified Successfully</h3>
                  <p className="text-gray-500 mb-4">Your email has been verified. Your seller account is now pending approval.</p>
                  <Button onClick={() => setActiveTab('pending')}>Check Application Status</Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <Mail size={48} className="mx-auto mb-4 text-blue-500" />
                    <h3 className="text-lg font-medium mb-2">Verify Your Email Address</h3>
                    <p className="text-gray-500">We've sent a verification code to your email address. Enter the code below to verify your email.</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="verification-code">Verification Code</Label>
                    <div className="flex gap-2">
                      <Input
                        id="verification-code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="Enter 6-digit code"
                        className="text-center text-lg tracking-widest"
                        maxLength={6}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleVerifyEmail} 
                    className="w-full"
                    disabled={verifyingEmail || verificationCode.length !== 6}
                  >
                    {verifyingEmail ? (
                      <>
                        <Loader2 size={16} className="mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Verify Email'
                    )}
                  </Button>
                  
                  <div className="text-center text-sm text-gray-500 mt-4">
                    <p>Didn't receive a code? <Button variant="link" className="p-0 h-auto" onClick={() => {
                      const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
                      console.log('New verification code:', randomCode);
                      localStorage.setItem('verificationCode', randomCode);
                      toast({
                        title: "New code sent",
                        description: `A new verification code has been sent to your email. (For demo: ${randomCode})`,
                      });
                    }}>Resend Code</Button></p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pending" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock size={18} className="text-yellow-500" />
                Application Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user?.storeDetails ? (
                <div className="text-center py-8">
                  {user?.sellerApproved ? (
                    <>
                      <CheckCircle size={48} className="mx-auto mb-4 text-green-500" />
                      <h3 className="text-lg font-medium mb-2">Application Approved!</h3>
                      <p className="text-gray-500 mb-6">Congratulations! Your seller account has been approved. You can now start selling products.</p>
                      <Button onClick={() => setActiveTab('dashboard')}>Go to Seller Dashboard</Button>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Clock size={32} className="text-yellow-500" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">Application Under Review</h3>
                      <p className="text-gray-500 mb-2">Your application is currently being reviewed by our team.</p>
                      <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                        <p className="text-sm font-medium">Application Details:</p>
                        <p className="text-sm text-gray-500">Store: {user.storeDetails.name}</p>
                        <p className="text-sm text-gray-500">Email: {user.email} {emailVerified && <span className="text-green-500">(✓ Verified)</span>}</p>
                        <p className="text-sm text-gray-500">Submitted: {new Date(user.sellerRequestDate || '').toLocaleDateString()}</p>
                      </div>
                      <p className="text-sm text-gray-500">We'll notify you by email once your application has been reviewed.</p>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <UserX size={48} className="mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">No Application Found</h3>
                  <p className="text-gray-500 mb-4">You haven't submitted a seller application yet.</p>
                  <Button onClick={() => setActiveTab('register')}>Register as Seller</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="dashboard" className="animate-fade-in">
          {renderSellerContent()}
        </TabsContent>

        <TabsContent value="products" className="animate-fade-in space-y-6">
          {user?.isSeller && user?.sellerApproved ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag size={18} />
                    Add New Product
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onProductSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Name</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Enter product name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="Describe your product" rows={3} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price</FormLabel>
                              <div className="relative">
                                <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                                <FormControl>
                                  <Input {...field} type="number" step="0.01" min="0" className="pl-8" />
                                </FormControl>
                              </div>
                              <FormMessage />
                              {form.watch('price') > 0 && (
                                <div className="mt-1 text-xs text-gray-500 flex justify-between">
                                  <span>Commission ({isVendorArexOriginal ? '0%' : '5%'}):</span>
                                  <span>{currencySymbol}{calculateCommission(form.watch('price')).toFixed(2)}</span>
                                </div>
                              )}
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="inventory"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Inventory</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" min="1" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="e.g. Electronics" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="brand"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Brand</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="e.g. Samsung" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Product Images (Required)</Label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {imagePreviewUrls.map((imageUrl, i) => (
                            <div key={i} className="relative w-20 h-20 border rounded-md overflow-hidden group">
                              <img src={imageUrl} alt={`Product ${i+1}`} className="w-full h-full object-cover" />
                              <button 
                                type="button" 
                                onClick={() => removeProductImage(i)}
                                className="absolute top-0 right-0 bg-black bg-opacity-50 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                          <label className="flex items-center justify-center w-20 h-20 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-50">
                            <Input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleProductImagesChange}
                              multiple
                            />
                            <Plus size={24} className="text-gray-400" />
                          </label>
                        </div>
                        {productImages.length === 0 && (
                          <p className="text-xs text-red-500">Upload at least one product image</p>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>Specifications</Label>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={addSpecification}
                          >
                            Add Spec
                          </Button>
                        </div>
                        
                        {specifications.map((spec, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <Input
                              placeholder="Feature"
                              value={spec.key}
                              onChange={(e) => updateSpecification(i, e.target.value, spec.value)}
                              className="flex-1"
                            />
                            <Input
                              placeholder="Value"
                              value={spec.value}
                              onChange={(e) => updateSpecification(i, spec.key, e.target.value)}
                              className="flex-1"
                            />
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm"
                              onClick={() => removeSpecification(i)}
                              disabled={specifications.length <= 1}
                            >
                              ✕
                            </Button>
                          </div>
                        ))}
                      </div>
                      
                      <Button type="submit" className="w-full">Add Product</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Your Products</CardTitle>
                </CardHeader>
                <CardContent>
                  {products.length > 0 ? (
                    <div className="space-y-4">
                      {products.map((product) => (
                        <div key={product.id} className="flex items-center p-3 border rounded-lg">
                          <div className="h-16 w-16 bg-gray-200 rounded-md overflow-hidden">
                            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                          </div>
                          <div className="ml-4 flex-1">
                            <h3 className="font-medium">{product.name}</h3>
                            <div className="flex justify-between text-sm text-gray-500">
                              <span>{currencySymbol}{product.price.toFixed(2)}</span>
                              <span>In stock: {product.inventory}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Package size={32} className="mx-auto mb-2" />
                      <p>You haven't added any products yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-10">
                <UserX size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">Access Denied</h3>
                <p className="text-gray-500 mb-4">You need to be an approved seller to access this section.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="orders" className="animate-fade-in">
          {user?.isSeller && user?.sellerApproved ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck size={18} />
                  Manage Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium">{order.productName}</h3>
                          <span className={`px-2 py-1 rounded text-xs ${
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'shipped' ? 'bg-green-100 text-green-800' :
                            'bg-gray-100'
                          }`}>
                            {order.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 mb-3">
                          <p>Order #{order.id}</p>
                          <p>Customer: {order.customer}</p>
                          <p>Date: {order.date}</p>
                        </div>
                        {!order.delivered ? (
                          selectedOrderId === order.id ? (
                            <div className="space-y-3">
                              <p className="text-sm">Confirm that the delivery person has picked up this order?</p>
                              <div className="flex gap-2">
                                <Button 
                                  size="sm" 
                                  onClick={() => confirmDelivery(order.id)}
                                  className="bg-green-500 hover:bg-green-600"
                                >
                                  Confirm
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => setSelectedOrderId(null)}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <Button 
                              size="sm"
                              variant="outline"
                              className="w-full"
                              onClick={() => setSelectedOrderId(order.id)}
                            >
                              Mark as Out for Delivery
                            </Button>
                          )
                        ) : (
                          <div className="flex items-center text-green-600">
                            <CheckCircle size={16} className="mr-1" />
                            <span className="text-sm">Out for delivery</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Package size={32} className="mx-auto mb-2" />
                    <p>You don't have any orders yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-10">
                <UserX size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">Access Denied</h3>
                <p className="text-gray-500 mb-4">You need to be an approved seller to access this section.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Admin section for approving sellers */}
        <TabsContent value="requests" className="animate-fade-in">
          {isAdmin ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield size={18} />
                  Approve Seller Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pendingSellerRequests.length > 0 ? (
                  <div className="space-y-4">
                    {pendingSellerRequests.map((sellerRequest) => (
                      <div key={sellerRequest.id} className="border rounded-md p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{sellerRequest.storeDetails?.name}</h3>
                          <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">Pending</span>
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-500 mb-3">
                          <p><span className="font-medium">Seller:</span> {sellerRequest.name}</p>
                          <p><span className="font-medium">Email:</span> {sellerRequest.email}</p>
                          <p><span className="font-medium">Store description:</span> {sellerRequest.storeDetails?.description}</p>
                          <p><span className="font-medium">Requested:</span> {new Date(sellerRequest.sellerRequestDate || '').toLocaleDateString()}</p>
                          <p className={`flex items-center ${sellerRequest.sellerVerified ? 'text-green-500' : 'text-yellow-500'}`}>
                            {sellerRequest.sellerVerified ? (
                              <>
                                <CheckCircle size={14} className="mr-1" />
                                Email verified
                              </>
                            ) : (
                              <>
                                <Clock size={14} className="mr-1" />
                                Email verification pending
                              </>
                            )}
                          </p>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="flex-1 bg-green-500 hover:bg-green-600"
                            onClick={() => handleApproveSeller(sellerRequest.id)}
                            disabled={!sellerRequest.sellerVerified}
                          >
                            <Check size={16} className="mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 border-red-300 text-red-500 hover:bg-red-50"
                            onClick={() => handleRejectSeller(sellerRequest.id)}
                          >
                            <X size={16} className="mr-1" />
                            Reject
                          </Button>
                        </div>
                        
                        {!sellerRequest.sellerVerified && (
                          <p className="text-xs text-yellow-600 mt-2">
                            Note: The seller must verify their email before they can be approved.
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle size={32} className="mx-auto mb-2" />
                    <p>No pending seller requests</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-10">
                <UserX size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">Access Denied</h3>
                <p className="text-gray-500 mb-4">You need to be an admin to access this section.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="settings" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Seller Settings</CardTitle>
            </CardHeader>
            <CardContent>
              {user?.isSeller && user?.sellerApproved ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 mb-2">
                      <Switch
                        id="arex-switch"
                        checked={isVendorArexOriginal}
                        onCheckedChange={setIsVendorArexOriginal}
                      />
                      <Label htmlFor="arex-switch" className="font-medium">I am an AREXORIGINAL vendor</Label>
                    </div>
                    {isVendorArexOriginal ? (
                      <p className="text-sm text-green-600">As an AREXORIGINAL vendor, you are exempt from the 5% commission fee.</p>
                    ) : (
                      <p className="text-sm text-gray-500">Standard 5% commission applies to all sales.</p>
                    )}
                  </div>
                  
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-2">Store Details</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="store-name">Store Name</Label>
                        <Input 
                          id="store-name"
                          value={user.storeDetails?.name}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="store-description">Store Description</Label>
                        <Textarea 
                          id="store-description"
                          value={user.storeDetails?.description}
                          className="mt-1"
                          rows={3}
                        />
                      </div>
                      <Button className="w-full">Update Store Details</Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <UserX size={48} className="mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">Not Available</h3>
                  <p className="text-gray-500 mb-4">You need to be an approved seller to access settings.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SellerPage;
