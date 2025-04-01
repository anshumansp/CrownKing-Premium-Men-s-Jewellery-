export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  subCategory: string;
  specifications: {
    material: string;
    weight: string;
    dimensions: string;
    warranty: string;
  };
  rating: number;
  reviews: number;
  inStock: boolean;
  featured: boolean;
  discount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  images: string[];
  category: string;
  subCategory: string;
  specifications: {
    [key: string]: string;
  };
  rating: number;
  reviews: number;
  inStock: boolean;
  featured: boolean;
  discount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentDetails: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    nameOnCard: string;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

export interface ProductFilterState {
  category: string | null;
  priceRange: [number, number];
  rating: number | null;
  sortBy: 'price-asc' | 'price-desc' | 'newest' | 'rating' | null;
} 