
import React from 'react';
import { useAppSettings } from '@/context/AppSettingsContext';

const AboutPage = () => {
  const { language } = useAppSettings();
  
  return (
    <div className="p-4">
      <div className="flex flex-col items-center mb-6">
        <img 
          src="/lovable-uploads/f1f11f46-3e99-449c-9040-b277a9805245.png" 
          alt="Arex Logo" 
          className="w-24 h-24 mb-4" 
        />
        <h1 className="text-3xl font-bold text-brand-blue">
          {language === 'ar' ? 'عن أريكس' : 'About Arex'}
        </h1>
      </div>

      <div className="space-y-4 max-w-2xl mx-auto">
        <p className="text-lg">
          {language === 'ar' 
            ? 'أريكس هي منصة تجارة إلكترونية رائدة توفر تجربة تسوق سلسة وممتعة للعملاء في جميع أنحاء العالم.'
            : 'Arex is a leading e-commerce platform providing a seamless and enjoyable shopping experience for customers worldwide.'}
        </p>

        <h2 className="text-xl font-semibold mt-6">
          {language === 'ar' ? 'رؤيتنا' : 'Our Vision'}
        </h2>
        <p>
          {language === 'ar'
            ? 'نسعى لنكون الوجهة المفضلة للتسوق عبر الإنترنت، حيث نجمع بين المنتجات عالية الجودة وخدمة العملاء المتميزة والأسعار التنافسية.'
            : 'We strive to be the preferred destination for online shopping, combining high-quality products, exceptional customer service, and competitive pricing.'}
        </p>

        <h2 className="text-xl font-semibold mt-6">
          {language === 'ar' ? 'ما يميزنا' : 'What Sets Us Apart'}
        </h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            {language === 'ar'
              ? 'منتجات عالية الجودة: نقدم فقط المنتجات ذات الجودة العالية من العلامات التجارية الموثوقة.'
              : 'Quality Products: We offer only high-quality products from trusted brands.'}
          </li>
          <li>
            {language === 'ar'
              ? 'خدمة عملاء متميزة: فريق دعم مخصص جاهز لمساعدتك في أي وقت.'
              : 'Customer Service: Our dedicated support team is ready to assist you at any time.'}
          </li>
          <li>
            {language === 'ar'
              ? 'شحن سريع: نضمن توصيل سريع وآمن لطلبك.'
              : 'Fast Shipping: We ensure quick and secure delivery of your order.'}
          </li>
          <li>
            {language === 'ar'
              ? 'سهولة الاستخدام: منصتنا سهلة الاستخدام وتوفر تجربة تسوق سلسة.'
              : 'User-Friendly: Our platform is easy to use and provides a smooth shopping experience.'}
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-6">
          {language === 'ar' ? 'اتصل بنا' : 'Contact Us'}
        </h2>
        <p>
          {language === 'ar'
            ? 'لديك أسئلة أو استفسارات؟ نحن هنا للمساعدة! تواصل معنا عبر:'
            : 'Have questions or inquiries? We are here to help! Contact us via:'}
        </p>
        <div className="space-y-1">
          <p>
            <strong>{language === 'ar' ? 'البريد الإلكتروني:' : 'Email:'}</strong> support@arex.com
          </p>
          <p>
            <strong>{language === 'ar' ? 'الهاتف:' : 'Phone:'}</strong> 
            {language === 'ar' 
              ? '٨٠٠-١٢٣-٤٥٦٧' 
              : '800-123-4567'}
          </p>
          <p>
            <strong>{language === 'ar' ? 'العنوان:' : 'Address:'}</strong> 
            {language === 'ar'
              ? 'شارع التجارة ١٢٣، الرياض، المملكة العربية السعودية'
              : '123 Commerce St, Riyadh, Saudi Arabia'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
