
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useAppSettings } from '@/context/AppSettingsContext';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CreditCard, DollarSign } from 'lucide-react';

interface PaymentMethodSelectorProps {
  value: 'cash' | 'card';
  onChange: (value: 'cash' | 'card') => void;
  disabled?: boolean;
}

const PaymentMethodSelector = ({ value, onChange, disabled = false }: PaymentMethodSelectorProps) => {
  const { theme } = useTheme();
  const { language, translations } = useAppSettings();
  const t = translations[language];

  return (
    <RadioGroup 
      value={value} 
      onValueChange={(newValue) => onChange(newValue as 'cash' | 'card')}
      className={disabled ? 'opacity-60 pointer-events-none' : ''}
    >
      <div className={`flex items-center space-x-2 rtl:space-x-reverse pb-3 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} mb-3`}>
        <RadioGroupItem value="cash" id="cash" disabled={disabled} />
        <Label htmlFor="cash" className="flex-1 cursor-pointer">
          <div className="flex items-center gap-2">
            <DollarSign size={16} className="text-green-500" />
            <div>
              <div className="font-medium">{t.cashOnDelivery}</div>
              <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {language === 'ar' ? 'الدفع عند استلام الطلب' : 'Pay when you receive the order'}
              </div>
            </div>
          </div>
        </Label>
      </div>
      <div className="flex items-center space-x-2 rtl:space-x-reverse">
        <RadioGroupItem value="card" id="card" disabled={disabled} />
        <Label htmlFor="card" className="flex-1 cursor-pointer">
          <div className="flex items-center gap-2">
            <CreditCard size={16} className="text-blue-500" />
            <div>
              <div className="font-medium">{t.cardPayment}</div>
              <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {language === 'ar' ? 'ادفع الآن ببطاقتك' : 'Pay now with your card'}
              </div>
            </div>
          </div>
        </Label>
      </div>
    </RadioGroup>
  );
};

export default PaymentMethodSelector;
