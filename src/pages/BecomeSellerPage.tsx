
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { AlertCircle, Store, CheckCircle } from 'lucide-react';
import { useAppSettings } from '@/context/AppSettingsContext';

const BecomeSellerPage = () => {
  const { user, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { language, translations } = useAppSettings();
  const t = translations[language];
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [storeInfo, setStoreInfo] = useState({
    name: '',
    description: '',
    logo: ''
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Update the user profile with seller status and store details
      await updateUserProfile({
        isSeller: true,
        storeDetails: storeInfo
      });
      
      toast({
        title: "Success!",
        description: "Your seller account has been created",
        duration: 3000,
      });
      
      // Move to success step
      setStep(3);
      
      // Navigate to seller dashboard after a delay
      setTimeout(() => {
        navigate('/seller/dashboard');
      }, 2000);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem creating your seller account",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (!user) {
    return (
      <Card className="mx-4 my-8">
        <CardHeader>
          <CardTitle>{language === 'ar' ? 'تسجيل الدخول مطلوب' : 'Login Required'}</CardTitle>
          <CardDescription>
            {language === 'ar' 
              ? 'يجب عليك تسجيل الدخول أولاً لتصبح بائعاً' 
              : 'You need to be logged in to become a seller'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate('/login')}>
            {language === 'ar' ? 'تسجيل الدخول' : 'Login'}
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  if (user.isSeller) {
    return (
      <Card className="mx-4 my-8">
        <CardHeader>
          <CardTitle>{language === 'ar' ? 'أنت بائع بالفعل!' : 'You are already a seller!'}</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate('/seller/dashboard')}>
            {language === 'ar' ? 'الذهاب إلى لوحة التحكم' : 'Go to Dashboard'}
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="pb-20 px-4 max-w-md mx-auto">
      {/* Header */}
      <div className="my-6">
        <h1 className="text-2xl font-bold mb-2">
          {language === 'ar' ? 'كن بائعًا' : 'Become a Seller'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'ar' 
            ? 'انضم إلينا وابدأ في بيع منتجاتك اليوم' 
            : 'Join our marketplace and start selling your products today'}
        </p>
      </div>
      
      {/* Step indicator */}
      <div className="flex justify-between mb-8">
        {[1, 2, 3].map((s) => (
          <div 
            key={s} 
            className={`flex flex-col items-center ${s < step ? 'text-primary' : s === step ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                s < step 
                  ? 'bg-primary text-primary-foreground' 
                  : s === step 
                    ? 'border-2 border-primary' 
                    : 'border-2 border-muted'
              }`}
            >
              {s < step ? <CheckCircle size={14} /> : s}
            </div>
            <span className="text-xs">
              {s === 1 ? (language === 'ar' ? 'معلومات' : 'Info') :
               s === 2 ? (language === 'ar' ? 'التحقق' : 'Verify') :
               (language === 'ar' ? 'تم' : 'Done')}
            </span>
          </div>
        ))}
      </div>
      
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'ar' ? 'معلومات المتجر' : 'Store Information'}
            </CardTitle>
            <CardDescription>
              {language === 'ar' 
                ? 'أخبرنا المزيد عن متجرك' 
                : 'Tell us more about your store'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName">
                    {language === 'ar' ? 'اسم المتجر' : 'Store Name'}
                  </Label>
                  <Input 
                    id="storeName"
                    value={storeInfo.name}
                    onChange={(e) => setStoreInfo({...storeInfo, name: e.target.value})}
                    placeholder={language === 'ar' ? 'أدخل اسم المتجر' : 'Enter store name'}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="storeDescription">
                    {language === 'ar' ? 'وصف المتجر' : 'Store Description'}
                  </Label>
                  <Textarea 
                    id="storeDescription"
                    value={storeInfo.description}
                    onChange={(e) => setStoreInfo({...storeInfo, description: e.target.value})}
                    placeholder={language === 'ar' ? 'اكتب وصفاً لمتجرك' : 'Write a description about your store'}
                    required
                    className="min-h-[100px]"
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  {language === 'ar' ? 'التالي' : 'Next'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>
              {language === 'ar' ? 'مراجعة المعلومات' : 'Review Information'}
            </CardTitle>
            <CardDescription>
              {language === 'ar' 
                ? 'تأكد من صحة المعلومات' 
                : 'Please verify your information'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'اسم المتجر' : 'Store Name'}
                </p>
                <p className="font-medium">{storeInfo.name}</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {language === 'ar' ? 'وصف المتجر' : 'Store Description'}
                </p>
                <p>{storeInfo.description}</p>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setStep(1)}>
                  {language === 'ar' ? 'رجوع' : 'Back'}
                </Button>
                <Button 
                  className="flex-1" 
                  onClick={handleSubmit} 
                  disabled={loading}
                >
                  {loading 
                    ? (language === 'ar' ? 'جاري المعالجة...' : 'Processing...') 
                    : (language === 'ar' ? 'تأكيد' : 'Confirm')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {step === 3 && (
        <Card>
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-center">
              {language === 'ar' ? 'تم إنشاء حساب البائع!' : 'Seller Account Created!'}
            </CardTitle>
            <CardDescription className="text-center">
              {language === 'ar'
                ? 'أنت الآن جاهز لإدارة متجرك وإضافة منتجات' 
                : 'You are now ready to manage your store and add products'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={() => navigate('/seller/dashboard')}>
              {language === 'ar' ? 'الذهاب إلى لوحة التحكم' : 'Go to Dashboard'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BecomeSellerPage;
