'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectCartItems,
  selectCartTotal,
  removeItem,
  updateQuantity
} from '@/redux/slices/cartSlice';
import { getProductById } from '@/services/productService';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/utils/auth';

// Define image mappings and fallbacks
const CATEGORY_IMAGE_MAP = {
  ring: '/jewe5.jpg',
  rings: '/jewe5.jpg',
  bracelet: '/jewe2.webp',
  bracelets: '/jewe2.webp',
  necklace: '/jewe1.webp',
  necklaces: '/jewe1.webp',
  pendant: '/jewe8.webp',
  pendants: '/jewe8.webp',
  watch: '/jewe12.webp',
  watches: '/jewe12.webp',
  accessory: '/jewe9.jpg',
  accessories: '/jewe9.jpg',
  earring: '/jewe6.avif',
  earrings: '/jewe6.avif',
  default: '/jewe1.webp' // Default fallback image
};

// Define the CartItem interface
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  images: string[];
  category?: string;
}

export default function Cart() {
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [updatedProducts, setUpdatedProducts] = useState<{ [key: string]: boolean }>({});
  // Always consider authenticated for cart operations
  const userAuthenticated = isAuthenticated('cart');

  // Effect to fetch missing product details
  useEffect(() => {
    const fetchMissingProductDetails = async () => {
      for (const item of cartItems) {
        // If the product is just an ID reference (price is 0) or name is "Product {id}"
        if (item.price === 0 || item.name.startsWith('Product ')) {
          try {
            const response = await getProductById(item.id);
            if (response?.data) {
              // Update the cart with the full product data
              dispatch(updateQuantity({
                id: item.id,
                quantity: item.quantity
              }));

              // Add the product details to our state
              setUpdatedProducts(prev => ({ ...prev, [item.id]: true }));
            }
          } catch (error) {
            console.error(`Failed to fetch details for product ${item.id}:`, error);
          }
        }
      }
    };

    if (cartItems.length > 0) {
      fetchMissingProductDetails();
    }
  }, [cartItems, dispatch]);

  const handleUpdateQuantity = (id: string, quantity: number) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleRemoveItem = (id: string) => {
    dispatch(removeItem(id));
  };

  const formatPrice = (price: number) => {
    return '₹' + price.toLocaleString('en-IN');
  };

  const handleCheckout = () => {
    setLoading(true);
    // Redirect to checkout page without turning off loading
    router.push('/checkout');
    // Don't set loading to false - we'll keep the button in loading state
    // until the page navigates, giving better user feedback
  };

  // Get image source with fallback
  const getImageSrc = (item: CartItem) => {
    if (item.images && item.images.length > 0 && !item.images[0].includes('example.com')) {
      return item.images[0];
    }

    // Use category-based fallback
    if (item.category) {
      const category = item.category.toLowerCase();
      for (const [key, value] of Object.entries(CATEGORY_IMAGE_MAP)) {
        if (category.includes(key)) {
          return value;
        }
      }
    }

    // Default fallback
    return CATEGORY_IMAGE_MAP.default;
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 mt-24 min-h-[calc(100vh-100px)] flex items-center justify-center">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-10 max-w-lg mx-auto text-center">
          <div className="mb-6">
            <div className="flex justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-brand-blue-dark mb-2">Your Cart is Empty</h2>
            <p className="text-gray-500 mb-6">It looks like you haven't added any items to your cart yet.</p>
            <div className="w-24 h-1 bg-gradient-to-r from-brand-primary to-brand-secondary mx-auto mb-6"></div>
          </div>
          <Link
            href="/products"
            className="inline-block bg-brand-primary text-white px-8 py-3 rounded-md hover:bg-brand-blue-light transition-colors duration-300 shadow-sm"
          >
            Explore Our Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-24 min-h-[calc(100vh-200px)]">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {cartItems.map((item: CartItem) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-4 flex items-center">
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={getImageSrc(item)}
                  alt={item.name}
                  fill
                  className="object-cover rounded"
                />
              </div>

              <div className="ml-4 flex-grow">
                <h3 className="font-medium text-brand-blue-dark">{item.name}</h3>
                <p className="text-brand-primary font-semibold">{formatPrice(item.price)}</p>

                <div className="flex items-center space-x-4 mt-2">
                  <div className="border border-gray-300 inline-flex items-center">
                    <button
                      onClick={() => item.quantity > 1 && handleUpdateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 border-x border-gray-300 min-w-[40px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="ml-4 flex flex-col items-end">
                <span className="font-semibold text-brand-primary">
                  {formatPrice(item.price * item.quantity)}
                </span>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="mt-2 text-red-500 hover:text-red-700"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 h-fit">
          <h2 className="text-xl font-semibold text-brand-blue-dark mb-4">Order Summary</h2>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span>Free</span>
            </div>
            <div className="border-t pt-3 mt-3">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Including taxes</p>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className={`block w-full bg-black text-white py-3 px-6 rounded-md text-center font-medium transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-800'}`}
          >
            {loading ? 'Processing...' : 'Proceed to Checkout'}
          </button>
        </div>
      </div>
    </div>
  );
}
