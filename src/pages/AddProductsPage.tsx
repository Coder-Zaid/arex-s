import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useProducts } from '@/context/ProductContext';
import { Plus, Image as ImageIcon, CheckCircle } from 'lucide-react';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const AddProductsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { products, addProduct } = useProducts();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (images.length + files.length > 5) {
        toast({ title: 'Max 5 images allowed', variant: 'destructive' });
        return;
      }
      setImages(prev => [...prev, ...files]);
      setImagePreviews(prev => [
        ...prev,
        ...files.map(file => URL.createObjectURL(file))
      ]);
    }
  };

  const removeImage = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
    setImagePreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !stock || images.length === 0) {
      toast({ title: 'All fields required, at least 1 image', variant: 'destructive' });
      return;
    }
    // Convert first image to base64
    const imageBase64 = await fileToBase64(images[0]);
    const newProduct = {
      id: `prod-${Date.now()}`,
      name,
      description: '',
      price: parseFloat(price),
      inventory: parseInt(stock),
      category: 'General',
      image: imageBase64,
      brand: '',
      rating: 0,
      inStock: parseInt(stock) > 0,
      isNew: true,
      images: imagePreviews,
    };
    addProduct(newProduct);
    toast({ title: 'Product added!' });
    setName(''); setPrice(''); setStock(''); setImages([]); setImagePreviews([]);
  };

  return (
    <div className="min-h-screen w-full bg-transparent pb-24 px-4 text-black">
      <div className="flex items-center gap-2 pt-6 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          &larr;
        </Button>
        <h1 className="text-2xl font-bold ml-2 flex items-center gap-2">
          <Plus size={24} className="text-brand-blue" /> Add Product
        </h1>
        <Button className="ml-auto" onClick={() => navigate('/seller-products')}>View All Products</Button>
      </div>
      <div className="max-w-lg mx-auto">
        <Card className="mb-6 shadow-xl rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon size={20} className="text-brand-blue" /> Add New Product
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Product Name</Label>
                <Input value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div>
                <Label>Price</Label>
                <Input type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required />
              </div>
              <div>
                <Label>Stock</Label>
                <Input type="number" min="1" value={stock} onChange={e => setStock(e.target.value)} required />
              </div>
              <div>
                <Label>Product Images (1-5)</Label>
                <Input type="file" accept="image/*" multiple onChange={handleImageChange} />
                <div className="flex gap-2 mt-2 flex-wrap">
                  {imagePreviews.map((url, idx) => (
                    <div key={idx} className="relative group">
                      <img src={url} alt="preview" className="w-20 h-20 object-cover rounded shadow" />
                      <Button type="button" size="icon" variant="destructive" className="absolute -top-2 -right-2" onClick={() => removeImage(idx)}>
                        &times;
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <Button type="submit" className="w-full bg-brand-blue text-white mt-4 text-lg py-3 rounded-xl flex items-center justify-center gap-2">
                <CheckCircle size={20} className="mr-2" /> Add Product
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddProductsPage; 