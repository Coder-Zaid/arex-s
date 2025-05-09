import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const addressSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().min(6, { message: "Phone number must be at least 6 digits." }),
  address: z.string().min(5, { message: "Address must be at least 5 characters." }),
});

type AddressFormValues = z.infer<typeof addressSchema>;

const ShippingAddressesPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [savedAddresses, setSavedAddresses] = useState<AddressFormValues[]>([]);
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      address: '',
    },
  });

  useEffect(() => {
    const storedAddresses = localStorage.getItem('savedAddresses');
    if (storedAddresses) {
      setSavedAddresses(JSON.parse(storedAddresses));
    }
  }, []);

  const onSubmit = (data: AddressFormValues) => {
    const updatedAddresses = [...savedAddresses, data];
    setSavedAddresses(updatedAddresses);
    localStorage.setItem('savedAddresses', JSON.stringify(updatedAddresses));
    toast({
      title: 'Address Saved',
      description: 'Your shipping address has been saved successfully.',
    });
    form.reset();
  };

  const selectAddress = (address: AddressFormValues) => {
    form.reset(address);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-brand-blue via-purple-700 to-red-500 pb-24 px-4 text-white">
      <div className="flex items-center gap-2 pt-6 mb-6">
        <Button variant="ghost" size="icon" className="text-white" onClick={() => navigate('/profile')}>
          <ChevronLeft />
        </Button>
        <h1 className="text-2xl font-bold ml-2">Shipping Addresses</h1>
      </div>
      <div className="max-w-md mx-auto">
        <Card className="bg-white/10 shadow-lg border-0 text-white">
          <CardHeader>
            <CardTitle>Add New Address</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" {...form.register('fullName')} />
                  {form.formState.errors.fullName && <p className="text-red-500">{form.formState.errors.fullName.message}</p>}
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" {...form.register('phone')} />
                  {form.formState.errors.phone && <p className="text-red-500">{form.formState.errors.phone.message}</p>}
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" {...form.register('address')} />
                  {form.formState.errors.address && <p className="text-red-500">{form.formState.errors.address.message}</p>}
                </div>
                <Button type="submit">Save Address</Button>
              </div>
            </form>
          </CardContent>
        </Card>
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Saved Addresses</CardTitle>
          </CardHeader>
          <CardContent>
            {savedAddresses.length > 0 ? (
              <div className="space-y-2">
                {savedAddresses.map((address, index) => (
                  <div key={index} className="p-2 border rounded">
                    <p><strong>Name:</strong> {address.fullName}</p>
                    <p><strong>Phone:</strong> {address.phone}</p>
                    <p><strong>Address:</strong> {address.address}</p>
                    <Button onClick={() => selectAddress(address)}>Select</Button>
                  </div>
                ))}
              </div>
            ) : (
              <p>No saved addresses found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShippingAddressesPage; 