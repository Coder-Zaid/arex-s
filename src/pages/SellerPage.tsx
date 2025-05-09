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
import { useTheme } from '@/context/ThemeContext';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useProducts } from '@/context/ProductContext';

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
    verifySellerIdentity,
    ownerEmail,
    ownerPhone
  } = useAuth();
  const { toast } = useToast();
  const { theme } = useTheme();
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
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [sellerPhone, setSellerPhone] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');
  const [sellerAge, setSellerAge] = useState<number>(18);
  const [identityDoc, setIdentityDoc] = useState<File | null>(null);
  const { currencySymbol, currency, convertPrice } = useAppSettings();
  const [sellerStatus, setSellerStatus] = useState<'pending' | 'accepted' | 'declined' | 'register'>('register');
  const [verificationCode, setVerificationCode] = useState('');
  const resendVerificationCode = () => {};
  const [showProductForm, setShowProductForm] = useState(false);
  const [adminTab, setAdminTab] = useState<'products' | 'approvals'>('products');
  const { products, addProduct, removeProduct } = useProducts();
  
  // Set the owner's contact information
  const OWNER_EMAIL = "arex.ksa@gmail.com";
  const OWNER_PHONE = "+966509738173";

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

  // Helper to check if user is admin
  const isAdminUser = user?.email === OWNER_EMAIL;

  const [localPendingRequests, setLocalPendingRequests] = useState(pendingSellerRequests);

  useEffect(() => {
    setLocalPendingRequests(pendingSellerRequests);
  }, [pendingSellerRequests]);

  useEffect(() => {
    if (user?.sellerApproved && user?.isSeller) {
      setSellerStatus('accepted');
    } else if (user && !user.sellerApproved) {
      setSellerStatus('pending');
    }
  }, [user]);

  useEffect(() => {
    // Reset seller tab state when user changes
    setStoreName('');
    setStoreDescription('');
    setLogoFile(null);
    setSellerPhone('');
    setSellerEmail('');
    setSellerAge(18);
    setIdentityDoc(null);
    if (!user?.storeDetails) {
      setSellerStatus('register');
      setActiveTab('register');
    } else if (user && !user.sellerApproved) {
      setSellerStatus('pending');
      setActiveTab('pending');
    }
  }, [user?.id]);

  useEffect(() => {
    if (isAdminUser) {
      setActiveTab('products');
    }
  }, [isAdminUser]);

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

  const handleStoreSubmit = async (e: React.FormEvent) => {
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
    if (identityDoc && identityDoc.size > 2 * 1024 * 1024) {
      toast({ title: 'File too large. Max 2MB allowed.', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    try {
      // Remove all emailjs logic and just register the seller in app state
      await requestSellerAccount(
        storeName,
        storeDescription,
        sellerPhone,
        sellerEmail,
        sellerAge,
        identityDoc,
        logoFile
      );
      setSellerStatus('pending');
      toast({
        title: 'Seller request sent',
        description: 'Your seller request was sent and is pending approval.'
      });
      setActiveTab('products');
    } catch (err) {
      toast({
        title: 'Could not send seller request',
        description: 'There was an error sending your request.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyEmail = async () => {
    // This function is removed as per the instructions
  };
  
  const handleApproveSeller = (sellerId: string) => {
    approveSellerRequest(sellerId)
      .then(() => {
        toast({
          title: "Seller approved",
          description: "The seller account has been approved successfully.",
        });
        setLocalPendingRequests(prev => prev.filter(req => req.id !== sellerId));
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
        setLocalPendingRequests(prev => prev.filter(req => req.id !== sellerId));
      });
  };
  
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const onProductSubmit = async (data: ProductFormValues) => {
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
    // Convert first image to base64
    const imageBase64 = await fileToBase64(productImages[0]);
    const newProduct: Product = {
      id: `seller-${Date.now()}`,
      name: data.name,
      description: data.description,
      price: data.price,
      inventory: data.inventory,
      category: data.category,
      image: imageBase64,
      brand: data.brand,
      rating: 0,
      inStock: data.inventory > 0,
      isNew: true,
      seller: user?.id || '',
    };
    addProduct(newProduct);
    form.reset();
    setProductImages([]);
    setImagePreviewUrls([]);
    setSpecifications([{ key: '', value: '' }]);
    setActiveTab('products');
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
    return price * 0.05; // 5% commission
  };

  // Content for different seller states
  const renderSellerContent = () => {
    if (sellerStatus === 'declined') {
      return (
        <div className="shadow-lg rounded-xl p-6 mb-6 text-center">
          <div className="flex items-center gap-2 mb-4 justify-center">
            <UserX size={18} className="text-red-500" />
            <span className="font-bold text-lg">Seller Application Declined</span>
          </div>
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <X size={32} className="text-red-500" />
          </div>
          <h3 className="text-lg font-medium mb-2">You were not accepted as a seller</h3>
          <p className="mb-4 text-gray-500">Unfortunately, your seller application was declined. Please contact support for more information.</p>
        </div>
      );
    }
    if (sellerStatus === 'pending') {
      return (
        <div className="shadow-lg rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={18} className="text-yellow-500" />
            <span className="font-bold text-lg">Seller Account Pending Approval</span>
          </div>
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock size={32} className="text-yellow-500" />
            </div>
            <h3 className="text-lg font-medium mb-2">Your seller application is under review</h3>
            <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Thank you for registering as a seller. Your application is currently being reviewed by our team.</p>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}>Store name: {storeName}</p>
          </div>
          {/* Demo admin controls for owner to accept/decline */}
          {user?.email === OWNER_EMAIL && (
            <div className="flex gap-2 justify-center mt-4">
              <Button onClick={async () => { setSellerStatus('accepted'); }} className="bg-green-500 hover:bg-green-600">Accept</Button>
              <Button onClick={async () => { setSellerStatus('declined'); }} className="bg-red-500 hover:bg-red-600">Decline</Button>
            </div>
          )}
        </div>
      );
    }
    if (sellerStatus === 'accepted') {
      // Show seller dashboard, add products, see sales, etc.
      return (
        <div>
          {/* Seller dashboard content here */}
          <div className="shadow-lg rounded-xl p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle size={18} className="text-green-500" />
              <span className="font-bold text-lg">Seller Dashboard</span>
            </div>
            <p className="mb-4 text-gray-500">Welcome! You can now add products, view your sales, and manage your store.</p>
            {/* Add product and sales management UI here */}
          </div>
        </div>
      );
    }
    if (sellerStatus === 'register') {
      return (
        <Card className="shadow-lg rounded-xl p-6 mb-6">
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
                  <Label htmlFor="store-name" className={theme === 'dark' ? 'text-white' : ''}>
                    Store Name <span className="text-red-500">*</span>
                  </Label>
                  <Input 
                    id="store-name"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="Your store name"
                    required
                    className="bg-white shadow rounded-lg text-black focus:ring-2 focus:ring-brand-blue focus:outline-none"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="store-description" className={theme === 'dark' ? 'text-white' : ''}>
                    Store Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea 
                    id="store-description"
                    value={storeDescription}
                    onChange={(e) => setStoreDescription(e.target.value)}
                    placeholder="Tell customers about your store"
                    rows={4}
                    required
                    className="bg-white shadow rounded-lg text-black focus:ring-2 focus:ring-brand-blue focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="seller-phone" className={theme === 'dark' ? 'text-white' : ''}>
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Phone className={`absolute left-2 top-2.5 h-4 w-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                      <Input
                        id="seller-phone"
                        value={sellerPhone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9+]/g, '');
                          setSellerPhone(val);
                        }}
                        placeholder="e.g. +966123456789"
                        className="pl-8 bg-white shadow rounded-lg text-black focus:ring-2 focus:ring-brand-blue focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="seller-email" className={theme === 'dark' ? 'text-white' : ''}>
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="seller-email"
                      type="email"
                      value={sellerEmail}
                      onChange={(e) => setSellerEmail(e.target.value)}
                      placeholder="Your email for seller communications"
                      required
                      className="bg-white shadow rounded-lg text-black focus:ring-2 focus:ring-brand-blue focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="seller-age" className={theme === 'dark' ? 'text-white' : ''}>
                      Age <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Calendar className={`absolute left-2 top-2.5 h-4 w-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                      <Input
                        id="seller-age"
                        type="number"
                        min="18"
                        max="100"
                        value={sellerAge}
                        onChange={(e) => setSellerAge(parseInt(e.target.value))}
                        className="pl-8 bg-white shadow rounded-lg text-black focus:ring-2 focus:ring-brand-blue focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="identity-doc" className={theme === 'dark' ? 'text-white' : ''}>
                      National Identity Document <span className="text-red-500">*</span>
                    </Label>
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
                        className="flex items-center gap-2 bg-brand-blue text-white shadow rounded-full px-4 py-2 cursor-pointer w-fit hover:opacity-90 transition-all"
                      >
                        <FileCheck size={16} />
                        {identityDoc ? identityDoc.name : 'Upload Document'}
                      </Label>
                      {!identityDoc && (
                        <p className="text-xs text-red-500 mt-1">Please upload your national identity document</p>
                      )}
                      {identityDoc && (
                        <p className={`text-xs text-green-500 mt-1 ${theme === 'dark' ? 'text-green-400' : ''}`}>Document uploaded</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <Switch
                      id="arex-switch"
                      checked={false}
                      onCheckedChange={() => {}}
                      className={theme === 'dark' ? 'data-[state=checked]:bg-green-500' : ''}
                      thumbClassName="bg-black"
                    />
                    <Label htmlFor="arex-switch" className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                      I am an AREXORIGINAL vendor
                    </Label>
                  </div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Standard 5% commission applies to all sales.</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="store-logo" className={theme === 'dark' ? 'text-white' : ''}>Store Logo</Label>
                  <div className="flex items-center gap-4">
                    <div className={`border rounded-lg w-24 h-24 flex items-center justify-center overflow-hidden ${
                      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                    }`}>
                      {logoFile ? (
                        <img 
                          src={URL.createObjectURL(logoFile)} 
                          alt="Store logo preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Image size={32} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} />
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
                        className="flex items-center gap-2 bg-brand-blue text-white shadow rounded-full px-4 py-2 cursor-pointer w-fit hover:opacity-90 transition-all"
                      >
                        <Upload size={16} />
                        Choose Image
                      </Label>
                    </div>
                  </div>
                </div>

                <div className={`border rounded-md p-4 mt-4 ${
                  theme === 'dark' ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-200'
                }`}>
                  <h3 className={`flex items-center font-medium mb-2 ${
                    theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
                  }`}>
                    <AlertCircle size={16} className="mr-2" />
                    Contact Information
                  </h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
                    For any questions or assistance with your seller application:
                  </p>
                  <div className="mt-2 text-sm">
                    <p className="flex items-center mb-1">
                      <Mail size={14} className={`mr-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
                      {OWNER_EMAIL}
                    </p>
                    <p className="flex items-center">
                      <Phone size={14} className={`mr-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
                      {OWNER_PHONE}
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

                <div className={`text-xs border-t pt-4 mt-4 ${theme === 'dark' ? 'text-gray-300 border-gray-700' : 'text-gray-500 border-gray-200'}`}>
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
                <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                  Your seller registration has been submitted.
                </p>
                <Button onClick={() => setActiveTab('verification')}>Continue to Verification</Button>
              </div>
            )}
          </CardContent>
        </Card>
      );
    }
    // Default: show registration form
    return (
      <Card className="shadow-lg rounded-xl p-6 mb-6">
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
                <Label htmlFor="store-name" className={theme === 'dark' ? 'text-white' : ''}>
                  Store Name <span className="text-red-500">*</span>
                </Label>
                <Input 
                  id="store-name"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="Your store name"
                  required
                  className="bg-white shadow rounded-lg text-black focus:ring-2 focus:ring-brand-blue focus:outline-none"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="store-description" className={theme === 'dark' ? 'text-white' : ''}>
                  Store Description <span className="text-red-500">*</span>
                </Label>
                <Textarea 
                  id="store-description"
                  value={storeDescription}
                  onChange={(e) => setStoreDescription(e.target.value)}
                  placeholder="Tell customers about your store"
                  rows={4}
                  required
                  className="bg-white shadow rounded-lg text-black focus:ring-2 focus:ring-brand-blue focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="seller-phone" className={theme === 'dark' ? 'text-white' : ''}>
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Phone className={`absolute left-2 top-2.5 h-4 w-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                    <Input
                      id="seller-phone"
                      value={sellerPhone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9+]/g, '');
                        setSellerPhone(val);
                      }}
                      placeholder="e.g. +966123456789"
                      className="pl-8 bg-white shadow rounded-lg text-black focus:ring-2 focus:ring-brand-blue focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seller-email" className={theme === 'dark' ? 'text-white' : ''}>
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="seller-email"
                    type="email"
                    value={sellerEmail}
                    onChange={(e) => setSellerEmail(e.target.value)}
                    placeholder="Your email for seller communications"
                    required
                    className="bg-white shadow rounded-lg text-black focus:ring-2 focus:ring-brand-blue focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="seller-age" className={theme === 'dark' ? 'text-white' : ''}>
                    Age <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Calendar className={`absolute left-2 top-2.5 h-4 w-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                    <Input
                      id="seller-age"
                      type="number"
                      min="18"
                      max="100"
                      value={sellerAge}
                      onChange={(e) => setSellerAge(parseInt(e.target.value))}
                      className="pl-8 bg-white shadow rounded-lg text-black focus:ring-2 focus:ring-brand-blue focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="identity-doc" className={theme === 'dark' ? 'text-white' : ''}>
                    National Identity Document <span className="text-red-500">*</span>
                  </Label>
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
                      className="flex items-center gap-2 bg-brand-blue text-white shadow rounded-full px-4 py-2 cursor-pointer w-fit hover:opacity-90 transition-all"
                    >
                      <FileCheck size={16} />
                      {identityDoc ? identityDoc.name : 'Upload Document'}
                    </Label>
                    {!identityDoc && (
                      <p className="text-xs text-red-500 mt-1">Please upload your national identity document</p>
                    )}
                    {identityDoc && (
                      <p className={`text-xs text-green-500 mt-1 ${theme === 'dark' ? 'text-green-400' : ''}`}>Document uploaded</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2 mb-2">
                  <Switch
                    id="arex-switch"
                    checked={false}
                    onCheckedChange={() => {}}
                    className={theme === 'dark' ? 'data-[state=checked]:bg-green-500' : ''}
                    thumbClassName="bg-black"
                  />
                  <Label htmlFor="arex-switch" className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                    I am an AREXORIGINAL vendor
                  </Label>
                </div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>Standard 5% commission applies to all sales.</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="store-logo" className={theme === 'dark' ? 'text-white' : ''}>Store Logo</Label>
                <div className="flex items-center gap-4">
                  <div className={`border rounded-lg w-24 h-24 flex items-center justify-center overflow-hidden ${
                    theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                  }`}>
                    {logoFile ? (
                      <img 
                        src={URL.createObjectURL(logoFile)} 
                        alt="Store logo preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image size={32} className={theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} />
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
                      className="flex items-center gap-2 bg-brand-blue text-white shadow rounded-full px-4 py-2 cursor-pointer w-fit hover:opacity-90 transition-all"
                    >
                      <Upload size={16} />
                      Choose Image
                    </Label>
                  </div>
                </div>
              </div>

              <div className={`border rounded-md p-4 mt-4 ${
                theme === 'dark' ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-200'
              }`}>
                <h3 className={`flex items-center font-medium mb-2 ${
                  theme === 'dark' ? 'text-blue-300' : 'text-blue-700'
                }`}>
                  <AlertCircle size={16} className="mr-2" />
                  Contact Information
                </h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
                  For any questions or assistance with your seller application:
                </p>
                <div className="mt-2 text-sm">
                  <p className="flex items-center mb-1">
                    <Mail size={14} className={`mr-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
                    {OWNER_EMAIL}
                  </p>
                  <p className="flex items-center">
                    <Phone size={14} className={`mr-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-500'}`} />
                    {OWNER_PHONE}
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

              <div className={`text-xs border-t pt-4 mt-4 ${theme === 'dark' ? 'text-gray-300 border-gray-700' : 'text-gray-500 border-gray-200'}`}>
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
              <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                Your seller registration has been submitted.
              </p>
              <Button onClick={() => setActiveTab('verification')}>Continue to Verification</Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };
  
  // Define tabs for different user types
  const renderTabs = () => {
    // For admins
    if (isAdmin) {
      return (
        <div className="flex w-full justify-between mb-4 gap-0">
          <button onClick={() => setActiveTab('products')} className={`bg-brand-blue text-white shadow rounded-full px-6 py-2 font-bold mx-1 ${activeTab === 'products' ? 'opacity-90' : 'opacity-80'} transition-all`}>Products</button>
          <button onClick={() => setActiveTab('orders')} className={`bg-brand-blue text-white shadow rounded-full px-6 py-2 font-bold mx-1 ${activeTab === 'orders' ? 'opacity-90' : 'opacity-80'} transition-all`}>Orders</button>
          <button onClick={() => setActiveTab('approvals')} className={`bg-green-600 text-white shadow rounded-full px-6 py-2 font-bold mx-1 ${activeTab === 'approvals' ? 'opacity-90' : 'opacity-80'} transition-all`}>Approve Sellers</button>
        </div>
      );
    }
    
    // For approved sellers
    if (user?.isSeller && user?.sellerApproved) {
      return (
        <div className="flex w-full justify-between mb-4 gap-0">
          <button onClick={() => setActiveTab('dashboard')} className={`bg-brand-blue text-white shadow rounded-full px-6 py-2 font-bold mx-1 ${activeTab === 'dashboard' ? 'opacity-90' : 'opacity-80'} transition-all`}>Dashboard</button>
          <button onClick={() => setActiveTab('products')} className={`bg-brand-blue text-white shadow rounded-full px-6 py-2 font-bold mx-1 ${activeTab === 'products' ? 'opacity-90' : 'opacity-80'} transition-all`}>Products</button>
          <button onClick={() => setActiveTab('orders')} className={`bg-brand-blue text-white shadow rounded-full px-6 py-2 font-bold mx-1 ${activeTab === 'orders' ? 'opacity-90' : 'opacity-80'} transition-all`}>Orders</button>
        </div>
      );
    }
    
    // For pending sellers or new users
    return (
      <div className="flex w-full justify-between mb-4 gap-0">
        <button onClick={() => setActiveTab('register')} className={`bg-brand-blue text-white shadow rounded-full px-6 py-2 font-bold mx-1 ${activeTab === 'register' ? 'opacity-90' : 'opacity-80'} transition-all`}>Register</button>
        <button onClick={() => setActiveTab('pending')} className={`bg-brand-blue text-white shadow rounded-full px-6 py-2 font-bold mx-1 ${activeTab === 'pending' ? 'opacity-90' : 'opacity-80'} transition-all`}>Status</button>
      </div>
    );
  };
  
  if (!isAuthenticated) {
    return (
      <Dialog open>
        <DialogContent style={{ textAlign: 'center', padding: 32 }}>
          <h2>Sign in to access Seller features</h2>
          <p>You need to be logged in to view and manage your seller account.</p>
          <Button onClick={() => navigate('/login')}>Login</Button>
          <Button variant="secondary" onClick={() => navigate('/register')} style={{ marginLeft: 8 }}>Register</Button>
        </DialogContent>
      </Dialog>
    );
  }

  if (isAdminUser) {
    return (
      <div className={`pb-20 pt-4 px-4 ${theme === 'dark' ? 'text-white' : ''}`}>
        <h1 className="text-2xl font-bold mb-4">Seller Center</h1>
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setAdminTab('products')}
            className={`px-6 py-2 rounded-full font-bold shadow transition-all text-white text-base focus:outline-none ${adminTab === 'products' ? 'bg-brand-blue scale-105' : 'bg-blue-200 hover:bg-brand-blue/80 hover:text-white text-brand-blue'}`}
          >
            <Plus size={18} className="inline-block mr-2 -mt-1" /> Products
          </button>
          <button
            onClick={() => setAdminTab('approvals')}
            className={`px-6 py-2 rounded-full font-bold shadow transition-all text-white text-base focus:outline-none ${adminTab === 'approvals' ? 'bg-green-600 scale-105' : 'bg-green-200 hover:bg-green-600/80 hover:text-white text-green-700'}`}
          >
            Approve Sellers
          </button>
        </div>
        {adminTab === 'products' && (
          <Card className={`shadow-lg rounded-xl border-0 ${theme === 'dark' ? 'bg-black/20' : 'bg-white/10'} backdrop-blur`}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Your Products</CardTitle>
              <Button onClick={() => navigate('/addproducts')}>
                <Plus size={16} className="mr-1" />
                Add Product
              </Button>
            </CardHeader>
            <CardContent>
              {showProductForm && (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onProductSubmit)} className={`space-y-4 mb-6 border-b pb-6 ${theme === 'dark' ? 'border-gray-700' : ''}`}> 
                    {/* ...form fields as in products tab... */}
                  </form>
                </Form>
              )}
              {/* ...rest of products tab content... */}
            </CardContent>
          </Card>
        )}
        {adminTab === 'approvals' && (
          <Card className={`shadow-lg rounded-xl border-0 ${theme === 'dark' ? 'bg-black/20' : 'bg-white/10'} backdrop-blur`}>
            <CardHeader>
              <CardTitle>Pending Seller Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {localPendingRequests.length > 0 ? (
                <div className="space-y-6">
                  {localPendingRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{request.storeDetails?.name}</h3>
                          <p className="text-sm text-gray-500">{request.displayName}</p>
                          <p className="text-sm text-gray-500">Email: {request.sellerEmail || request.email}</p>
                          <p className="text-sm text-gray-500">Phone: {request.sellerPhone || request.phone}</p>
                          <p className="text-sm text-gray-500">Description: {request.storeDetails?.description}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white" onClick={() => handleApproveSeller(request.id)}>
                            <Check size={14} className="mr-1" /> Approve
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleRejectSeller(request.id)}>
                            <X size={14} className="mr-1" /> Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No pending seller requests.</div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  if (user?.isSeller && user?.sellerApproved) {
    // Show seller management UI (tabs for Products, Orders, Approvals, etc.)
    return (
      <div className={`pb-20 pt-4 px-4 ${theme === 'dark' ? 'text-white' : ''}`}>
        <h1 className="text-2xl font-bold mb-4">Seller Center</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {renderTabs()}
          {/* ...TabsContent for products, orders, approvals, etc... */}
        </Tabs>
      </div>
    );
  }
  if (user?.isSeller && !user?.sellerApproved) {
    // Show 'under review' page
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="bg-white/80 dark:bg-gray-900/80 shadow-xl rounded-2xl p-8 flex flex-col items-center">
          <Clock size={48} className="text-yellow-500 mb-4 animate-pulse" />
          <h2 className="text-2xl font-bold mb-2">Your seller application is under review</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4 text-center max-w-md">
            Thank you for registering as a seller! Our team is reviewing your application. You'll be notified as soon as you're approved.
          </p>
          <Loader2 size={32} className="text-brand-blue animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className={`pb-20 pt-4 px-4 ${theme === 'dark' ? 'text-white' : ''}`}>
      <h1 className="text-2xl font-bold mb-4">Seller Center</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {renderTabs()}
        
        <TabsContent value="register" className="animate-fade-in">
          {renderSellerContent()}
        </TabsContent>

        <TabsContent value="pending" className="animate-fade-in">
          <Card className={`shadow-lg rounded-xl border-0 ${theme === 'dark' ? 'bg-black/20' : 'bg-white/10'} backdrop-blur`}>
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
                      <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                        Congratulations! Your seller account has been approved. You can now start selling products.
                      </p>
                      <Button onClick={() => setActiveTab('dashboard')}>Go to Seller Dashboard</Button>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Clock size={32} className="text-yellow-500" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">Application Under Review</h3>
                      <p className={`mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                        Your application is currently being reviewed by our team.
                      </p>
                      <div className={`p-4 rounded-lg mb-6 text-left ${
                        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                      }`}>
                        <p className="text-sm font-medium">Application Details:</p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                          Store: {user.storeDetails.name}
                        </p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                          Email: {user.sellerEmail || user.email} 
                        </p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                          Phone: {user.sellerPhone || user.phone}
                        </p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                          Identity Document: 
                        </p>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                          Submitted: {new Date(user.sellerRequestDate || '').toLocaleDateString()}
                        </p>
                      </div>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                        We'll notify you by email once your application has been reviewed.
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <UserX size={48} className="mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">No Application Found</h3>
                  <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                    You haven't submitted a seller application yet.
                  </p>
                  <Button onClick={() => setActiveTab('register')}>Register as Seller</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="animate-fade-in">
          <Card className={`shadow-lg rounded-xl border-0 ${theme === 'dark' ? 'bg-black/20' : 'bg-white/10'} backdrop-blur`}>
            <CardHeader>
              <CardTitle>Pending Seller Requests ({pendingSellerRequests.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingSellerRequests.length > 0 ? (
                <div className="space-y-6">
                  {pendingSellerRequests.map((request) => (
                    <div 
                      key={request.id} 
                      className={`border rounded-lg p-4 ${
                        theme === 'dark' ? 'border-gray-700' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{request.storeDetails?.name}</h3>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                            {request.displayName}
                          </p>
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
                          <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                            Store Details:
                          </p>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                            {request.storeDetails?.description}
                          </p>
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : ''}`}>
                            Contact Information:
                          </p>
                          <p className={`text-sm flex items-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                            <Phone size={14} className="mr-2 text-gray-400" />
                            {request.sellerPhone || 'Not provided'}
                          </p>
                          <p className={`text-sm flex items-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                            <Mail size={14} className="mr-2 text-gray-400" />
                            {request.sellerEmail || request.email}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                          Request date: {new Date(request.sellerRequestDate || '').toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="mt-4 flex gap-2">
                        {!request.sellerIdentityVerified && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleVerifyIdentity(request.id)}
                            className={theme === 'dark' ? 'border-gray-700 hover:bg-gray-800' : ''}
                          >
                            <Shield size={14} className="mr-1" />
                            Verify Identity
                          </Button>
                        )}
                        
                        <Button 
                          size="sm" 
                          variant="default"
                          onClick={() => handleApproveSeller(request.id)}
                          className="bg-green-500 hover:bg-green-600 text-white"
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
                  <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}>
                    There are no pending seller requests at this time.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="dashboard" className="animate-fade-in">
          {renderSellerContent()}
        </TabsContent>
        
        <TabsContent value="products" className="animate-fade-in">
          <Card className={`shadow-lg rounded-xl border-0 ${theme === 'dark' ? 'bg-black/20' : 'bg-white/10'} backdrop-blur`}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Your Products</CardTitle>
              <Button onClick={() => form.reset()}>
                <Plus size={16} className="mr-1" />
                Add Product
              </Button>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onProductSubmit)} className={`space-y-4 mb-6 border-b pb-6 ${
                  theme === 'dark' ? 'border-gray-700' : ''
                }`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={theme === 'dark' ? 'text-white' : ''}>Product Name</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="e.g. Wireless Headphones" 
                              className={theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : ''}
                            />
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
                          <FormLabel className={theme === 'dark' ? 'text-white' : ''}>
                            Price ({currencySymbol})
                          </FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              type="number" 
                              step="0.01" 
                              min="0" 
                              placeholder="0.00" 
                              className={theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : ''}
                            />
                          </FormControl>
                          <FormMessage />
                          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Commission: {currencySymbol}{calculateCommission(form.getValues('price')).toFixed(2)} (5%)
                          </p>
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
                          <FormLabel className={theme === 'dark' ? 'text-white' : ''}>Category</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="e.g. Electronics" 
                              className={theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : ''}
                            />
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
                          <FormLabel className={theme === 'dark' ? 'text-white' : ''}>Brand</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="e.g. SoundMaster" 
                              className={theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : ''}
                            />
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
                        <FormLabel className={theme === 'dark' ? 'text-white' : ''}>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="Describe your product in detail" 
                            rows={4} 
                            className={theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : ''}
                          />
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
                        <FormLabel className={theme === 'dark' ? 'text-white' : ''}>Inventory</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="number" 
                            min="0" 
                            step="1" 
                            placeholder="0" 
                            className={theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-2">
                    <Label className={theme === 'dark' ? 'text-white' : ''}>Product Images</Label>
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
                      <div className={`border-dashed rounded-md h-20 w-20 flex items-center justify-center ${
                        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border'
                      }`}>
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
                          <Plus size={16} className={`mb-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                          <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Add</span>
                        </Label>
                      </div>
                    </div>
                    {productImages.length === 0 && (
                      <p className="text-xs text-red-500">Please upload at least one product image</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label className={theme === 'dark' ? 'text-white' : ''}>Specifications</Label>
                    {specifications.map((spec, index) => (
                      <div key={index} className="flex gap-2">
                        <Input 
                          placeholder="Name (e.g. Weight)" 
                          value={spec.key}
                          onChange={(e) => updateSpecification(index, e.target.value, spec.value)}
                          className={`flex-1 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : ''}`}
                        />
                        <Input 
                          placeholder="Value (e.g. 500g)" 
                          value={spec.value}
                          onChange={(e) => updateSpecification(index, spec.key, e.target.value)}
                          className={`flex-1 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : ''}`}
                        />
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removeSpecification(index)}
                          disabled={specifications.length <= 1}
                          className={theme === 'dark' ? 'hover:bg-gray-800' : ''}
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
                      className={`w-full mt-2 ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-800' : ''}`}
                    >
                      <Plus size={16} className="mr-1" />
                      Add Specification
                    </Button>
                  </div>
                  
                  <Button type="submit" className="w-full">Add Product</Button>
                </form>
                
                <div className="mt-8">
                  <h3 className={`font-medium mb-4 ${theme === 'dark' ? 'text-white' : ''}`}>
                    Your Listed Products ({products.length})
                  </h3>
                  {products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {products.map(product => (
                        <div 
                          key={product.id} 
                          className={`border rounded-md p-4 flex gap-4 ${
                            theme === 'dark' ? 'border-gray-700' : ''
                          }`}
                        >
                          <div className={`h-16 w-16 rounded overflow-hidden ${
                            theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                          }`}>
                            <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{product.name}</h4>
                            <p className={`text-sm line-clamp-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                              {product.description}
                            </p>
                            <div className="flex justify-between items-center mt-2">
                              <span className="font-medium">{currencySymbol}{convertPrice(product.price).toFixed(2)}</span>
                              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                Stock: {product.inventory}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package size={48} className={`mx-auto mb-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                      <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}>
                        You haven't added any products yet
                      </p>
                    </div>
                  )}
                </div>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders" className="animate-fade-in">
          <Card className={`shadow-lg rounded-xl border-0 ${theme === 'dark' ? 'bg-black/20' : 'bg-white/10'} backdrop-blur`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package size={18} />
                Your Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package size={48} className={`mx-auto mb-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                  <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}>
                    No orders yet. When customers purchase your products, they will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div 
                      key={order.id} 
                      className={`border rounded-xl p-6 ${
                        theme === 'dark' ? 'border-gray-700 bg-gray-800/50' : 'bg-white'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-bold text-lg mb-1">{order.productName}</h3>
                              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                Order ID: {order.id}
                              </p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                              order.status === 'delivered' 
                                ? 'bg-green-100 text-green-800' 
                                : order.status === 'out-for-delivery'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                Customer Details
                              </p>
                              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                {order.customer}
                              </p>
                            </div>
                            <div>
                              <p className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                Order Date
                              </p>
                              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                {new Date(order.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          {order.status === 'out-for-delivery' && (
                            <div className="mt-4">
                              <p className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                Delivery Date
                              </p>
                              <Input
                                type="date"
                                value={order.deliveryDate || ''}
                                onChange={e => {
                                  const updatedOrders = orders.map(o => 
                                    o.id === order.id ? { ...o, deliveryDate: e.target.value } : o
                                  );
                                  setOrders(updatedOrders);
                                }}
                                className={theme === 'dark' ? 'bg-gray-700 border-gray-600' : ''}
                              />
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-2 justify-center">
                          {order.status === 'pending' && (
                            <Button 
                              onClick={() => {
                                const updatedOrders = orders.map(o => 
                                  o.id === order.id ? { ...o, status: 'out-for-delivery' } : o
                                );
                                setOrders(updatedOrders);
                                toast({
                                  title: "Order Updated",
                                  description: "Order marked as out for delivery",
                                });
                              }}
                              className="bg-yellow-500 hover:bg-yellow-600 text-white"
                            >
                              <Truck size={16} className="mr-2" />
                              Mark as Out for Delivery
                            </Button>
                          )}
                          
                          {order.status === 'out-for-delivery' && order.deliveryDate && (
                            <Button 
                              onClick={() => {
                                const updatedOrders = orders.map(o => 
                                  o.id === order.id ? { ...o, status: 'delivered' } : o
                                );
                                setOrders(updatedOrders);
                                toast({
                                  title: "Order Delivered",
                                  description: "Order has been marked as delivered",
                                });
                              }}
                              className="bg-green-500 hover:bg-green-600 text-white"
                            >
                              <Check size={16} className="mr-2" />
                              Mark as Delivered
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="animate-fade-in">
          <Card className={`shadow-lg rounded-xl border-0 ${theme === 'dark' ? 'bg-black/20' : 'bg-white/10'} backdrop-blur`}>
            <CardHeader>
              <CardTitle>Seller Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>Commission Rate</h3>
                  <div className={`p-4 rounded-md ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                  }`}>
                    <p>Your current commission rate: <span className="font-medium">5%</span></p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>Store Information</h3>
                  <div className={`p-4 rounded-md ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                  }`}>
                    <div className="space-y-1">
                      <p>
                        <span className="font-medium">Store name:</span> {user?.storeDetails?.name}
                      </p>
                      <p>
                        <span className="font-medium">Description:</span> {user?.storeDetails?.description}
                      </p>
                    </div>
                    <Button 
                      className="mt-4" 
                      variant="outline" 
                      size="sm"
                      disabled={true}
                    >
                      <img src={user?.storeDetails?.logo || '/placeholder.svg'} alt="Logo" className="h-4 w-4 mr-2" />
                      Update Store Logo
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>Contact Information</h3>
                  <div className={`p-4 rounded-md space-y-2 ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                  }`}>
                    <div className="flex justify-between">
                      <p>
                        <span className="font-medium">Email:</span> {user?.sellerEmail || user?.email}
                      </p>
                      <Button variant="link" size="sm" className="h-auto p-0">Update</Button>
                    </div>
                    <div className="flex justify-between">
                      <p>
                        <span className="font-medium">Phone:</span> {user?.sellerPhone || user?.phone}
                      </p>
                      <Button variant="link" size="sm" className="h-auto p-0">Update</Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>Verification Status</h3>
                  <div className={`p-4 rounded-md ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                  }`}>
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

                <div className="space-y-2">
                  <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>Owner Contact</h3>
                  <div className={`p-4 rounded-md ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                  }`}>
                    <div className="space-y-2">
                      <p className="flex items-center">
                        <Mail size={16} className="mr-2 text-blue-500" />
                        <span className="font-medium">Email:</span> 
                        <span className="ml-2">{OWNER_EMAIL}</span>
                      </p>
                      <p className="flex items-center">
                        <Phone size={16} className="mr-2 text-blue-500" />
                        <span className="font-medium">Phone:</span>
                        <span className="ml-2">{OWNER_PHONE}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approvals" className="animate-fade-in">
          <div className="grid gap-6">
            {localPendingRequests.length === 0 ? (
              <div className="text-center text-gray-500 py-12">No pending seller requests.</div>
            ) : (
              localPendingRequests.map(request => (
                <div key={request.id} className="bg-white dark:bg-gray-900 shadow rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{request.storeDetails?.name}</h3>
                    <p className="text-gray-500 mb-1">{request.sellerEmail || request.email}</p>
                    <p className="text-gray-500 mb-1">{request.sellerPhone || request.phone}</p>
                    <p className="text-gray-400 text-sm">{request.storeDetails?.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow" onClick={() => handleApproveSeller(request.id)}>Approve</button>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow" onClick={() => handleRejectSeller(request.id)}>Reject</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SellerPage;
