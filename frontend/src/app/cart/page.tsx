'use client'; // Mark as client component for potential state management

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TrashIcon } from '@heroicons/react/24/outline';

// Placeholder cart data (replace with actual state management/API data)
const cartItems = [
  {
    id: 'ck1',
    name: "Men's Jewellery Item 1",
    price: 199.99,
    quantity: 1,
    imageUrl: 'https://picsum.photos/seed/productpage1/100/100',
    slug: 'mens-jewellery-item-1',
  },
  {
    id: 'ck3',
    name: "Men's Jewellery Item 3",
    price: 89.50,
    quantity: 2,
    imageUrl: 'https://picsum.photos/seed/productpage3/100/100',
    slug: 'mens-jewellery-item-3',
  },
];

const calculateSubtotal = () => {
  return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
};

const CartPage: React.FC = () => {
  const subtotal = calculateSubtotal();
  const shippingEstimate = 5.00; // Example shipping cost
  const taxEstimate = subtotal * 0.08; // Example 8% tax
  const total = subtotal + shippingEstimate + taxEstimate;

  const handleRemoveItem = (id: string) => {
    // Placeholder for remove item logic
    console.log(`Remove item ${id}`);
    // Update cart state here
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
     // Placeholder for update quantity logic
     console.log(`Update item ${id} quantity to ${quantity}`);
     // Update cart state here (ensure quantity >= 1)
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-brand-dark-blue mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <p className="text-xl text-gray-600 mb-4">Your cart is empty.</p>
          <Link
            href="/products"
            className="bg-brand-teal hover:bg-brand-dark-blue text-white font-semibold py-2 px-6 rounded-md transition duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center bg-white p-4 rounded-lg shadow border border-gray-200">
                <div className="relative w-20 h-20 mr-4 flex-shrink-0">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded"
                  />
                </div>
                <div className="flex-grow">
                  <Link href={`/products/${item.slug}`} className="text-lg font-medium text-brand-dark-blue hover:text-brand-teal">
                    {item.name}
                  </Link>
                  <p className="text-sm text-gray-500">Price: ${item.price.toFixed(2)}</p>
                  <div className="flex items-center mt-2">
                    <label htmlFor={`quantity-${item.id}`} className="sr-only">Quantity</label>
                    <input
                      id={`quantity-${item.id}`}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value, 10))}
                      className="w-16 p-1 border border-gray-300 rounded-md text-center focus:ring-brand-teal focus:border-brand-teal"
                    />
                  </div>
                </div>
                <div className="text-right ml-4 flex-shrink-0">
                  <p className="text-lg font-semibold text-brand-dark-blue mb-2">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Remove item"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200 sticky top-24"> {/* Sticky summary */}
              <h2 className="text-xl font-semibold text-brand-dark-blue mb-6 border-b pb-3">Order Summary</h2>
              <div className="space-y-3 mb-6 text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping estimate</span>
                  <span>${shippingEstimate.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax estimate</span>
                  <span>${taxEstimate.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between font-semibold text-xl text-brand-dark-blue border-t pt-4">
                <span>Order total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <Link href="/checkout">
                <button className="mt-6 w-full bg-brand-teal hover:bg-brand-dark-blue text-white font-semibold py-3 rounded-md transition duration-300 shadow-md">
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
