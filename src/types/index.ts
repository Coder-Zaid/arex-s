import { User as FirebaseUser } from 'firebase/auth';

export interface CustomUserData {
  id: string;
  address?: string;
  phone?: string;
  bio?: string;
  isSeller?: boolean;
  sellerVerified?: boolean;
  sellerApproved?: boolean;
  sellerRequestDate?: string;
  sellerPhone?: string;
  sellerEmail?: string;
  sellerIdentityVerified?: boolean;
  sellerAge?: number;
  sellerIdentityDoc?: string;
  storeDetails?: {
    name: string;
    description: string;
    logo?: string;
  };
}

export interface User extends FirebaseUser, CustomUserData {}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  images?: string[];
  category: string;
  brand: string;
  seller?: string;
  rating: number;
  reviews?: Review[];
  inStock?: boolean;
  inventory?: number;
  isNew?: boolean;
  featured?: boolean;
  onSale?: boolean;
  oldPrice?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  date: string;
}

export interface Review {
  id: string;
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
