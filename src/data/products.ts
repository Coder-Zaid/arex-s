import { Product, Banner } from '../types';

export const products: Product[] = [];

export const banners: Banner[] = [
  {
    id: "1",
    title: "Flash Sale",
    description: "Up to 50% off on select electronics!",
    image: "/placeholder.svg",
    link: "/category/sale"
  },
  {
    id: "2",
    title: "New Arrivals",
    description: "Check out the latest tech gadgets",
    image: "/placeholder.svg",
    link: "/category/new"
  },
  {
    id: "3",
    title: "Premium Audio",
    description: "Exclusive deals on high-end audio equipment",
    image: "/placeholder.svg",
    link: "/category/audio"
  }
];
