
export interface User {
  id: string;
  email: string;
  name: string;
  address?: string;
  phone?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  image: string;
  category: string;
  brand: string;
  rating: number;
  inStock: boolean;
  featured?: boolean;
  isNew?: boolean;
  onSale?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  currency: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  paymentMethod: 'cash' | 'card';
  deliveryAddress: string;
  orderDate: string;
  estimatedDelivery?: string;
}

export interface Banner {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
}
