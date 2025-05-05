
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useAppSettings } from '@/context/AppSettingsContext';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

const AboutPage = () => {
  const { theme } = useTheme();
  const { language } = useAppSettings();
  
  return (
    <div className="pb-24 flex flex-col min-h-screen overflow-auto">
      {/* Header Image */}
      <div className="w-full h-40 bg-gradient-to-r from-blue-500 to-purple-600 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-3xl font-bold text-white">Arex</h1>
        </div>
      </div>
      
      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        {/* About Us Section */}
        <section>
          <h2 className="text-xl font-bold mb-3 text-foreground">
            {language === 'ar' ? 'عن الشركة' : 'About Us'}
          </h2>
          <p className="text-foreground/80">
            {language === 'ar' 
              ? 'أريكس هي منصة تسوق إلكتروني تهدف إلى تقديم منتجات عالية الجودة بأسعار تنافسية. نحن نؤمن بتوفير تجربة تسوق سلسة ومريحة لجميع عملائنا.'
              : 'Arex is an e-commerce platform dedicated to delivering high-quality products at competitive prices. We believe in providing a seamless and convenient shopping experience for all our customers.'}
          </p>
        </section>
        
        {/* Our Mission */}
        <section>
          <h2 className="text-xl font-bold mb-3 text-foreground">
            {language === 'ar' ? 'مهمتنا' : 'Our Mission'}
          </h2>
          <p className="text-foreground/80">
            {language === 'ar'
              ? 'مهمتنا هي بناء منصة تسوق رقمية موثوقة تربط البائعين بالمستهلكين وتسهل المعاملات الآمنة. نحن نسعى جاهدين لتقديم خدمة استثنائية ومنتجات ذات قيمة عالية.'
              : 'Our mission is to build a trusted digital shopping platform that connects sellers with consumers and facilitates secure transactions. We strive to provide exceptional service and high-value products.'}
          </p>
        </section>
        
        {/* Our Values */}
        <section>
          <h2 className="text-xl font-bold mb-3 text-foreground">
            {language === 'ar' ? 'قيمنا' : 'Our Values'}
          </h2>
          <ul className="list-disc list-inside space-y-2 text-foreground/80">
            <li>
              {language === 'ar' ? 'الجودة: نلتزم بتقديم منتجات عالية الجودة.' : 'Quality: We are committed to offering high-quality products.'}
            </li>
            <li>
              {language === 'ar' ? 'الأمان: نضع أمان معاملاتك في صدارة أولوياتنا.' : 'Security: We prioritize the safety of your transactions.'}
            </li>
            <li>
              {language === 'ar' ? 'خدمة العملاء: نقدم دعمًا استثنائيًا للعملاء.' : 'Customer Service: We provide exceptional customer support.'}
            </li>
            <li>
              {language === 'ar' ? 'الابتكار: نسعى دائمًا لتحسين منصتنا وخدماتنا.' : 'Innovation: We continuously strive to improve our platform and services.'}
            </li>
          </ul>
        </section>
        
        {/* Contact Information */}
        <section>
          <h2 className="text-xl font-bold mb-3 text-foreground">
            {language === 'ar' ? 'تواصل معنا' : 'Contact Us'}
          </h2>
          <div className="space-y-3">
            <div className="flex items-center">
              <Mail className="mr-2 text-blue-500" size={18} />
              <span className="text-foreground/80">support@arex.com</span>
            </div>
            <div className="flex items-center">
              <Phone className="mr-2 text-blue-500" size={18} />
              <span className="text-foreground/80">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center">
              <MapPin className="mr-2 text-blue-500" size={18} />
              <span className="text-foreground/80">123 E-Commerce St, Digital City, 10001</span>
            </div>
            <div className="flex items-center">
              <Globe className="mr-2 text-blue-500" size={18} />
              <span className="text-foreground/80">www.arex.com</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
