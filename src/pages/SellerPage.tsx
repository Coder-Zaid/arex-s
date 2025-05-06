
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
  Shield,
  Phone,
  Calendar,
  FileCheck,
  AlertCircle
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
  const { 
    user, 
    isAuthenticated, 
    requestSellerAccount, 
    approveSellerRequest, 
    rejectSellerRequest, 
    pendingSellerRequests,
    verifySellerEmail,
    resendVerificationCode,
    verifySellerIdentity,
    ownerEmail,
    ownerPhone
  } = useAuth();
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
  const [sellerPhone, setSellerPhone] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');
  const [sellerAge, setSellerAge] = useState<number>(18);
  const [identityDoc, setIdentityDoc] = useState<File | null>(null);
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

  const handleIdentityDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIdentityDoc(e.target.files[0]);
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
    
    // Form validation
    if (!storeName || !storeDescription || !sellerPhone || !sellerEmail || !sellerAge) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    if (!identityDoc) {
      toast({
        title: "Missing document",
        description: "Please upload your national identity document",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Submit seller request with additional information
    requestSellerAccount(
      storeName, 
      storeDescription, 
      sellerPhone,
      sellerEmail,
      sellerAge,
      identityDoc,
      logoFile || undefined
    )
      .then(() => {
        setIsSubmitting(false);
        // Switch to verification tab after registration
        setActiveTab('verification');
      })
      .catch(() => {
        setIsSubmitting(false);
      });
  };

  const handleVerifyEmail = async () => {
    setVerifyingEmail(true);
    
    try {
      const isVerified = await verifySellerEmail(verificationCode);
      
      if (isVerified) {
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
    } finally {
      setVerifyingEmail(false);
    }
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
  
  const handleVerifyIdentity = (sellerId: string) => {
    verifySellerIdentity(sellerId)
      .then(() => {
        toast({
          title: "Identity verified",
          description: "The seller's identity has been verified successfully.",
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
                    <Label htmlFor="store-name">Store Name <span className="text-red-500">*</span></Label>
                    <Input 
                      id="store-name"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      placeholder="Your store name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="store-description">Store Description <span className="text-red-500">*</span></Label>
                    <Textarea 
                      id="store-description"
                      value={storeDescription}
                      onChange={(e) => setStoreDescription(e.target.value)}
                      placeholder="Tell customers about your store"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="seller-phone">Phone Number <span className="text-red-500">*</span></Label>
                      <div className="relative">
                        <Phone className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          id="seller-phone"
                          value={sellerPhone}
                          onChange={(e) => setSellerPhone(e.target.value)}
                          placeholder="e.g. +966123456789"
                          className="pl-8"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="seller-email">Email <span className="text-red-500">*</span></Label>
                      <Input
                        id="seller-email"
                        type="email"
                        value={sellerEmail}
                        onChange={(e) => setSellerEmail(e.target.value)}
                        placeholder="Your email for seller communications"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="seller-age">Age <span className="text-red-500">*</span></Label>
                      <div className="relative">
                        <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                          id="seller-age"
                          type="number"
                          min="18"
                          max="100"
                          value={sellerAge}
                          onChange={(e) => setSellerAge(parseInt(e.target.value))}
                          className="pl-8"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="identity-doc">National Identity Document <span className="text-red-500">*</span></Label>
                      <div className="flex flex-col">
                        <Input
                          id="identity-doc"
                          type="file"
                          onChange={handleIdentityDocChange}
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                        />
                        <Label 
                          htmlFor="identity-doc"
                          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md cursor-pointer w-fit"
                        >
                          <FileCheck size={16} />
                          {identityDoc ? identityDoc.name : 'Upload Document'}
                        </Label>
                        {!identityDoc && (
                          <p className="text-xs text-red-500 mt-1">Please upload your national identity document</p>
                        )}
                        {identityDoc && (
                          <p className="text-xs text-green-500 mt-1">Document uploaded</p>
                        )}
                      </div>
                    </div>
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

                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-4">
                    <h3 className="flex items-center text-blue-700 font-medium mb-2">
                      <AlertCircle size={16} className="mr-2" />
                      Contact Information
                    </h3>
                    <p className="text-sm text-blue-700">For any questions or assistance with your seller application:</p>
                    <div className="mt-2 text-sm">
                      <p className="flex items-center mb-1">
                        <Mail size={14} className="mr-2 text-blue-500" />
                        {ownerEmail}
                      </p>
                      <p className="flex items-center">
                        <Phone size={14} className="mr-2 text-blue-500" />
                        {ownerPhone}
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-brand-blue hover:bg-brand-blue/90 mt-4"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Register as Seller'
                    )}
                  </Button>

                  <div className="text-xs text-gray-500 border-t pt-4 mt-4">
                    <p className="mb-2">By registering as a seller, you agree to our terms and conditions:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>You must verify your email address</li>
                      <li>You must provide a valid national identity document</li>
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
              {emailVerified || user?.sellerVerified ? (
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
                    <p className="text-gray-500">We've sent a verification code to your email address ({user?.sellerEmail || user?.email}). Enter the code below to verify your email.</p>
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
                    <p>Didn't receive a code? <Button variant="link" className="p-0 h-auto" onClick={resendVerificationCode}>Resend Code</Button></p>
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
                        <p className="text-sm text-gray-500">Email: {user.sellerEmail || user.email} 
                          {(user.sellerVerified || emailVerified) ? 
                            <span className="text-green-500 ml-1">(✓ Verified)</span> : 
                            <span className="text-red-500 ml-1">(Not Verified)</span>
                          }
                        </p>
                        <p className="text-sm text-gray-500">Phone: {user.sellerPhone || user.phone}</p>
                        <p className="text-sm text-gray-500">Identity Document: 
                          {user.sellerIdentityVerified ? 
                            <span className="text-green-500 ml-1">(✓ Verified)</span> : 
                            <span className="text-yellow-500 ml-1">(Pending Verification)</span>
                          }
                        </p>
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

        <TabsContent value="requests" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Pending Seller Requests ({pendingSellerRequests.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingSellerRequests.length > 0 ? (
                <div className="space-y-6">
                  {pendingSellerRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{request.storeDetails?.name}</h3>
                          <p className="text-sm text-gray-500">{request.name}</p>
                        </div>
                        <div className="flex items-center">
                          {request.sellerVerified ? (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center mr-2">
                              <Check size={12} className="mr-1" /> Email Verified
                            </span>
                          ) : (
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center mr-2">
                              <X size={12} className="mr-1" /> Email Not Verified
                            </span>
                          )}
                          {request.sellerIdentityVerified ? (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                              <Check size={12} className="mr-1" /> Identity Verified
                            </span>
                          ) : (
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center">
                              <Shield size={12} className="mr-1" /> Identity Pending
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">Store Details:</p>
                          <p className="text-sm text-gray-500">{request.storeDetails?.description}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Contact Information:</p>
                          <p className="text-sm text-gray-500 flex items-center">
                            <Phone size={14} className="mr-2 text-gray-400" />
                            {request.sellerPhone || 'Not provided'}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center">
                            <Mail size={14} className="mr-2 text-gray-400" />
                            {request.sellerEmail || request.email}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <p className="text-xs text-gray-500">Request date: {new Date(request.sellerRequestDate || '').toLocaleDateString()}</p>
                      </div>
                      
                      <div className="mt-4 flex gap-2">
                        {!request.sellerIdentityVerified && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleVerifyIdentity(request.id)}
                          >
                            <Shield size={14} className="mr-1" />
                            Verify Identity
                          </Button>
                        )}
                        
                        <Button 
                          size="sm" 
                          variant="default"
                          onClick={() => handleApproveSeller(request.id)}
                          disabled={!request.sellerVerified || !request.sellerIdentityVerified}
                        >
                          <Check size={14} className="mr-1" />
                          Approve
                        </Button>
                        
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleRejectSeller(request.id)}
                        >
                          <X size={14} className="mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle size={48} className="mx-auto mb-4 text-green-500" />
                  <h3 className="text-lg font-medium mb-2">No Pending Requests</h3>
                  <p className="text-gray-500">There are no pending seller requests at this time.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="dashboard" className="animate-fade-in">
          {renderSellerContent()}
        </TabsContent>
        
        <TabsContent value="products" className="animate-fade-in">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Your Products</CardTitle>
              <Button onClick={() => form.reset()}>
                <Plus size={16} className="mr-1" />
                Add Product
              </Button>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onProductSubmit)} className="space-y-4 mb-6 border-b pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g. Wireless Headphones" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price ({currencySymbol})</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" step="0.01" min="0" placeholder="0.00" />
                          </FormControl>
                          <FormMessage />
                          {isVendorArexOriginal ? (
                            <p className="text-xs text-green-600">No commission (AREXORIGINAL vendor)</p>
                          ) : (
                            <p className="text-xs text-gray-500">
                              Commission: {currencySymbol}{calculateCommission(form.getValues('price')).toFixed(2)} (5%)
                            </p>
                          )}
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <Input {...field} placeholder="e.g. SoundMaster" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Describe your product in detail" rows={4} />
                        </FormControl>
                        <FormMessage />
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
                          <Input {...field} type="number" min="0" step="1" placeholder="0" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-2">
                    <Label>Product Images</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {imagePreviewUrls.map((url, index) => (
                        <div key={index} className="relative group border rounded-md h-20 w-20 overflow-hidden">
                          <img src={url} alt={`Preview ${index}`} className="h-full w-full object-cover" />
                          <div 
                            className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                            onClick={() => removeProductImage(index)}
                          >
                            <X className="text-white cursor-pointer" size={16} />
                          </div>
                        </div>
                      ))}
                      <div className="border border-dashed rounded-md h-20 w-20 flex items-center justify-center bg-gray-50">
                        <Input
                          id="product-images"
                          type="file"
                          accept="image/*"
                          onChange={handleProductImagesChange}
                          className="hidden"
                          multiple
                        />
                        <Label 
                          htmlFor="product-images" 
                          className="flex flex-col items-center justify-center cursor-pointer h-full w-full"
                        >
                          <Plus size={16} className="mb-1 text-gray-400" />
                          <span className="text-xs text-gray-400">Add</span>
                        </Label>
                      </div>
                    </div>
                    {productImages.length === 0 && (
                      <p className="text-xs text-red-500">Please upload at least one product image</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Specifications</Label>
                    {specifications.map((spec, index) => (
                      <div key={index} className="flex gap-2">
                        <Input 
                          placeholder="Name (e.g. Weight)" 
                          value={spec.key}
                          onChange={(e) => updateSpecification(index, e.target.value, spec.value)}
                          className="flex-1"
                        />
                        <Input 
                          placeholder="Value (e.g. 500g)" 
                          value={spec.value}
                          onChange={(e) => updateSpecification(index, spec.key, e.target.value)}
                          className="flex-1"
                        />
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removeSpecification(index)}
                          disabled={specifications.length <= 1}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addSpecification}
                      className="w-full mt-2"
                    >
                      <Plus size={16} className="mr-1" />
                      Add Specification
                    </Button>
                  </div>
                  
                  <Button type="submit" className="w-full">Add Product</Button>
                </form>
                
                <div className="mt-8">
                  <h3 className="font-medium mb-4">Your Listed Products ({products.length})</h3>
                  {products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {products.map(product => (
                        <div key={product.id} className="border rounded-md p-4 flex gap-4">
                          <div className="h-16 w-16 bg-gray-100 rounded overflow-hidden">
                            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{product.name}</h4>
                            <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="font-medium">{currencySymbol}{product.price.toFixed(2)}</span>
                              <span className="text-sm text-gray-500">Stock: {product.inventory}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package size={48} className="mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-500">You haven't added any products yet</p>
                    </div>
                  )}
                </div>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Manage Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">Order #{order.id}</h4>
                          <p className="text-sm text-gray-500">{order.productName}</p>
                        </div>
                        <div>
                          {order.status === 'pending' ? (
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Pending</span>
                          ) : order.status === 'processing' ? (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Processing</span>
                          ) : order.status === 'shipped' ? (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Shipped</span>
                          ) : null}
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        <p>Customer: {order.customer}</p>
                        <p>Date: {order.date}</p>
                      </div>
                      <div className="mt-4 flex justify-end">
                        {!order.delivered && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedOrderId(order.id)}
                          >
                            <Truck size={14} className="mr-1" />
                            Mark as Shipped
                          </Button>
                        )}
                      </div>
                      
                      {selectedOrderId === order.id && (
                        <div className="mt-4 bg-gray-50 p-4 rounded-md">
                          <h5 className="font-medium text-sm mb-2">Confirm Delivery</h5>
                          <p className="text-sm text-gray-500 mb-4">Are you sure you want to mark this order as shipped?</p>
                          <div className="flex justify-end gap-2">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => setSelectedOrderId(null)}
                            >
                              Cancel
                            </Button>
                            <Button 
                              size="sm" 
                              variant="default"
                              onClick={() => confirmDelivery(order.id)}
                            >
                              Confirm
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">You don't have any orders yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Seller Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-medium">Commission Rate</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    {isVendorArexOriginal ? (
                      <p className="text-green-600 font-medium">You are an AREXORIGINAL vendor and exempt from commission fees.</p>
                    ) : (
                      <p>Your current commission rate: <span className="font-medium">5%</span></p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Store Information</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="space-y-1">
                      <p><span className="font-medium">Store name:</span> {user?.storeDetails?.name}</p>
                      <p><span className="font-medium">Description:</span> {user?.storeDetails?.description}</p>
                    </div>
                    <Button className="mt-4" variant="outline" size="sm">
                      <img src={user?.storeDetails?.logo || '/placeholder.svg'} alt="Logo" className="h-4 w-4 mr-2" />
                      Update Store Logo
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Contact Information</h3>
                  <div className="bg-gray-50 p-4 rounded-md space-y-2">
                    <div className="flex justify-between">
                      <p><span className="font-medium">Email:</span> {user?.sellerEmail || user?.email}</p>
                      <Button variant="link" size="sm" className="h-auto p-0">Update</Button>
                    </div>
                    <div className="flex justify-between">
                      <p><span className="font-medium">Phone:</span> {user?.sellerPhone || user?.phone}</p>
                      <Button variant="link" size="sm" className="h-auto p-0">Update</Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Verification Status</h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Email:</span> 
                      {user?.sellerVerified ? (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                          <Check size={12} className="mr-1" /> Verified
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center">
                          <X size={12} className="mr-1" /> Not Verified
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-medium">Identity:</span> 
                      {user?.sellerIdentityVerified ? (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                          <Check size={12} className="mr-1" /> Verified
                        </span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center">
                          <Clock size={12} className="mr-1" /> Pending
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SellerPage;
