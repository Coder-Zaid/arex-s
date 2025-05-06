
export interface User {
  id: string;
  email: string;
  name: string;
  address?: string;
  phone?: string;
  isSeller?: boolean;
  sellerVerified?: boolean;
  sellerApproved?: boolean;
  sellerRequestDate?: string;
  sellerPhone?: string; // Added for seller phone number
  sellerEmail?: string; // Added for seller email
  sellerIdentityVerified?: boolean; // Added for identity verification
  sellerAge?: number; // Added for age verification
  sellerIdentityDoc?: string; // Added for identity document
  storeDetails?: {
    name: string;
    description: string;
    logo?: string;
  };
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  image: string;
  images?: string[];
  category: string;
  brand: string;
  rating: number;
  inStock: boolean;
  featured?: boolean;
  isNew?: boolean;
  onSale?: boolean;
  sellerId?: string;
  inventory?: number;
  specifications?: {key: string; value: string}[];
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
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'cash' | 'card';
  paymentStatus?: 'pending' | 'paid' | 'refunded' | 'failed';
  deliveryAddress: string;
  orderDate: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  trackingNumber?: string;
  sellerId?: string;
  buyerId?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Banner {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
}

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface DeliveryEstimate {
  minDays: number;
  maxDays: number;
  distance?: number;
  estimatedDate?: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  messages: SupportMessage[];
}

export interface SupportMessage {
  id: string;
  ticketId: string;
  senderId: string;
  message: string;
  timestamp: string;
  isStaff: boolean;
}
