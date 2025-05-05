
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Store, Upload, Image, CheckCircle } from 'lucide-react';

const SellerPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [storeName, setStoreName] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('register');

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Registration successful",
        description: "Your seller account has been created.",
      });
      setIsSubmitting(false);
      setActiveTab('dashboard');
    }, 1500);
  };
  
  return (
    <div className="pb-20 pt-4 px-4">
      <h1 className="text-2xl font-bold mb-4">Seller Center</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="register">Register</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        </TabsList>
        
        <TabsContent value="register" className="animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store size={18} />
                Become a Seller
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                  {isSubmitting ? 'Registering...' : 'Register as Seller'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="dashboard" className="animate-fade-in">
          {storeName ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-500" />
                  Your Store is Active
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium">{storeName}</p>
                <p className="text-gray-500 mb-4">{storeDescription}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-sm text-gray-500">Products</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-sm text-gray-500">Orders</p>
                  </div>
                </div>
                
                <Button 
                  className="w-full mb-2"
                  onClick={() => navigate('/seller-dashboard')}
                >
                  Go to Full Dashboard
                </Button>
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/new-product')}
                >
                  Add New Product
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-10">
              <Store size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">You're not registered as a seller yet</h3>
              <p className="text-gray-500 mb-4">Register to start selling your products</p>
              <Button onClick={() => setActiveTab('register')}>Register Now</Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SellerPage;
