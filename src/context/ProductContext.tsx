import React, { createContext, useState, useContext, useEffect } from 'react';
import { Product } from '@/types';
import { useToast } from '@/components/ui/use-toast';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  removeProduct: (productId: string) => void;
}

// Helper: white background for images (for now, just use the original as placeholder)
const withWhiteBg = (img: string) => img; // In real use, process to remove bg or use a service

// Initial product data (replace image strings with actual base64 or URLs as needed)
const initialProducts: Product[] = [
  {
    id: 'fan-65',
    name: '3D Fan 65cm',
    description: 'A 65cm 3D hologram fan display for eye-catching advertising and presentations. High brightness, remote control, and easy installation.',
    price: 697.5,
    image: '/lovable-uploads/3D-fan-65cm-1.png',
    images: [
      '/lovable-uploads/3D-fan-65cm-1.png',
      '/lovable-uploads/3D-fan-65cm-2.png',
      '/lovable-uploads/3D-fan-65cm-3.png',
    ],
    category: '3D Fan',
    brand: 'SpinDisplay',
    seller: 'admin',
    rating: 4.8,
    inStock: true,
    inventory: 10,
    isNew: true,
    featured: true,
  },
  {
    id: 'fan-50',
    name: '3D Fan 50cm',
    description: 'A 50cm 3D hologram fan for digital signage and advertising. Delivers vivid 3D visuals and supports multiple formats.',
    price: 157.5,
    image: '/lovable-uploads/3D-fan-50cm-1.png',
    images: [
      '/lovable-uploads/3D-fan-50cm-1.png',
      '/lovable-uploads/3D-fan-50cm-2.png',
      '/lovable-uploads/3D-fan-50cm-3.png',
    ],
    category: '3D Fan',
    brand: 'SpinDisplay',
    seller: 'admin',
    rating: 4.7,
    inStock: true,
    inventory: 10,
    isNew: true,
    featured: false,
  },
  {
    id: 'fan-42',
    name: '3D Fan 35cm',
    description: 'A compact 35cm 3D hologram fan for immersive advertising. Lightweight, portable, and easy to set up.',
    price: 126.0,
    image: '/lovable-uploads/3D-fan-35cm-1.png',
    images: [
      '/lovable-uploads/3D-fan-35cm-1.png',
      '/lovable-uploads/3D-fan-35cm-2.png',
      '/lovable-uploads/3D-fan-35cm-3.png',
    ],
    category: '3D Fan',
    brand: 'SpinDisplay',
    seller: 'admin',
    rating: 4.6,
    inStock: true,
    inventory: 10,
    isNew: true,
    featured: false,
  },
  {
    id: 'glass-round',
    name: 'Glass Cleaning Round',
    description: 'Automatic round glass cleaning robot for windows. Smart navigation, strong suction, and remote control.',
    price: 585.0,
    image: '/lovable-uploads/glass-cleaning-round-1.png',
    images: [
      '/lovable-uploads/glass-cleaning-round-1.png',
      '/lovable-uploads/glass-cleaning-round-2.png',
      '/lovable-uploads/glass-cleaning-round-3.png',
    ],
    category: 'Cleaning',
    brand: 'Fmart',
    seller: 'admin',
    rating: 4.5,
    inStock: true,
    inventory: 10,
    isNew: true,
    featured: true,
  },
  {
    id: 'logo-projector',
    name: 'Logo Projector',
    description: 'High-definition logo projector for business branding. Projects crisp, bright logos on any surface.',
    price: 697.5,
    image: '/lovable-uploads/projector-1.png',
    images: [
      '/lovable-uploads/projector-1.png',
      '/lovable-uploads/projector-2.png',
      '/lovable-uploads/projector-3.png',
    ],
    category: 'Projector',
    brand: 'Generic',
    seller: 'admin',
    rating: 4.9,
    inStock: true,
    inventory: 10,
    isNew: true,
    featured: true,
  },
  {
    id: 'glass-square',
    name: 'Glass Cleaning Square',
    description: 'Square glass cleaning robot for windows. Efficient, quiet, and easy to use with remote control.',
    price: 630.0,
    image: '/lovable-uploads/glass-cleaning-square-1.png',
    images: [
      '/lovable-uploads/glass-cleaning-square-1.png',
      '/lovable-uploads/glass-cleaning-square-2.png',
      '/lovable-uploads/glass-cleaning-square-3.png',
    ],
    category: 'Cleaning',
    brand: 'Fmart',
    seller: 'admin',
    rating: 4.4,
    inStock: true,
    inventory: 10,
    isNew: true,
    featured: false,
  },
];

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const stored = localStorage.getItem('products');
    if (stored) return JSON.parse(stored);
    return initialProducts;
  });
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const addProduct = (product: Product) => {
    setProducts(prev => {
      const newProducts = [product, ...prev];
      toast({
        title: "Product added",
        description: "New product has been added successfully.",
      });
      return newProducts;
    });
  };

  const updateProduct = (product: Product) => {
    setProducts(prev => {
      const newProducts = prev.map(p => p.id === product.id ? product : p);
      toast({
        title: "Product updated",
        description: "Product has been updated successfully.",
      });
      return newProducts;
    });
  };

  const removeProduct = (productId: string) => {
    setProducts(prev => {
      const newProducts = prev.filter(p => p.id !== productId);
      toast({
        title: "Product removed",
        description: "Product has been removed successfully.",
      });
      return newProducts;
    });
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, removeProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}; 