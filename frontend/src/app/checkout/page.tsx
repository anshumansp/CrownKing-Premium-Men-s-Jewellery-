'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItems, selectCartTotal, clearCart } from '@/redux/slices/cartSlice';
import { clearCartAsync } from '@/redux/api/cartApi';
import * as orderService from '@/services/orderService';
import { isAuthenticated } from '@/utils/auth';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

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

export default function Checkout() {
  const router = useRouter();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Shipping, 2: Review, 3: Payment
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });

  // New: Add form error state
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [formTouched, setFormTouched] = useState<{ [key: string]: boolean }>({});
  const [paymentMethod, setPaymentMethod] = useState('cod');

  // Get image source with fallback
  const getImageSrc = (item: any) => {
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

  // New: Updated handleInputChange to include validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Mark field as touched
    setFormTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validate the field
    validateField(name, value);
  };

  // New: Field validation function
  const validateField = (name: string, value: string) => {
    let error = '';

    if (!value.trim()) {
      error = `${name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1').toLowerCase()} is required`;
    } else {
      switch (name) {
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            error = 'Please enter a valid email address';
          }
          break;
        case 'phone':
          const phoneRegex = /^\d{10}$/;
          if (!phoneRegex.test(value)) {
            error = 'Please enter a valid 10-digit phone number';
          }
          break;
        case 'zipCode':
          const zipRegex = /^\d{6}$/;
          if (!zipRegex.test(value)) {
            error = 'Please enter a valid 6-digit PIN code';
          }
          break;
      }
    }

    setFormErrors(prev => ({
      ...prev,
      [name]: error
    }));

    return !error;
  };

  const formatPrice = (price: number) => {
    return '₹' + price.toLocaleString('en-IN');
  };

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
  };

  // New: Updated validateShippingInfo function
  const validateShippingInfo = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode', 'country'];
    let isValid = true;
    const newErrors: { [key: string]: string } = {};
    const newTouched: { [key: string]: boolean } = {};

    // Mark all fields as touched
    requiredFields.forEach(field => {
      newTouched[field] = true;
      const value = formData[field as keyof typeof formData] as string;
      if (!validateField(field, value)) {
        isValid = false;
      }
    });

    setFormTouched(prev => ({ ...prev, ...newTouched }));

    if (!isValid) {
    // Find the first error to show in toast
      for (const field of requiredFields) {
        if (formErrors[field]) {
          toast.error(formErrors[field]);
          break;
        }
      }
    }

    return isValid;
  };

  const handleBackToShipping = () => {
    setStep(1);
    window.scrollTo(0, 0);
  };

  const handleContinueToPayment = () => {
    setStep(3);
    window.scrollTo(0, 0);
  };

  const handleBackToReview = () => {
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);

    try {
      // Calculate totals
      const subtotal = cartTotal;
      const shipping = cartTotal > 10000 ? 0 : 100;
      const tax = cartTotal * 0.18;
      const total = subtotal + shipping + tax;

      // Create shipping address object
      const shippingAddress = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country
      };

      // Create payment details object
      const paymentDetails = {
        method: paymentMethod,
        // For COD, we don't need actual card details
        cardNumber: 'N/A',
        expiryDate: 'N/A',
        cvv: 'N/A',
        nameOnCard: `${formData.firstName} ${formData.lastName}`
      };

      // Create order data
      const orderData = {
        shippingAddress,
        paymentDetails,
        shippingMethod: cartTotal > 10000 ? 'free' : 'standard'
      };

      // If user is authenticated, create order via API
      if (isAuthenticated()) {
        const response = await orderService.createOrder(orderData);

        if (response.success) {
          // Display success message
          toast.success('Order placed successfully!');

          // Clear cart in backend
          await dispatch(clearCartAsync());

          // Clear cart in Redux store
          dispatch(clearCart());

          // Navigate to confirmation page with order ID
          router.push(`/orders/confirmation?orderId=${response.data.id}`);
        } else {
          throw new Error('Failed to create order');
        }
      } else {
        // For unauthenticated users, just simulate order creation
        // In a real app, you would create a guest order or prompt for login
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Display success message
        toast.success('Order placed successfully!');

        // Clear cart
        dispatch(clearCart());

        // Navigate to confirmation page
        router.push('/orders/confirmation');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // If cart is empty, redirect to cart page
  if (typeof cartItems === 'undefined' || cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen">
        <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-lg mx-auto text-center">
          <h2 className="text-2xl font-bold text-brand-primary mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some items to your cart before checking out.</p>
          <Link href="/products" className="inline-block bg-brand-primary text-white px-6 py-3 rounded-md">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // New: Form field component to reduce repetition
  const FormField = ({
    name,
    label,
    type = 'text',
    placeholder = '',
    hint = '',
    options = []
  }: {
    name: string;
    label: string;
    type?: string;
    placeholder?: string;
    hint?: string;
    options?: { value: string, label: string }[]
  }) => {
    const hasError = !!formErrors[name] && formTouched[name];

    if (type === 'select') {
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={name}>
            {label} *
            {hint && <span className="text-xs text-gray-500 ml-1">({hint})</span>}
          </label>
          <select
            id={name}
            name={name}
            value={formData[name as keyof typeof formData] as string}
        onChange={handleInputChange}
            onBlur={() => setFormTouched(prev => ({ ...prev, [name]: true }))}
            className={`w-full border ${hasError ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary`}
        required
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          {hasError && (
            <p className="mt-1 text-sm text-red-500">{formErrors[name]}</p>
          )}
    </div>
      );
    }

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor={name}>
          {label} *
          {hint && <span className="text-xs text-gray-500 ml-1">({hint})</span>}
        </label>
        <input
          type={type}
          id={name}
          name={name}
          value={formData[name as keyof typeof formData] as string}
          onChange={handleInputChange}
          onBlur={() => setFormTouched(prev => ({ ...prev, [name]: true }))}
          placeholder={placeholder}
          className={`w-full border ${hasError ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary`}
          required
        />
        {hasError && (
          <p className="mt-1 text-sm text-red-500">{formErrors[name]}</p>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-24 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>

      {/* Checkout Steps */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <div className={`flex flex-col items-center ${step >= 1 ? 'text-brand-primary' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step >= 1 ? 'bg-brand-primary text-white' : 'bg-gray-200'}`}>
              1
            </div>
            <span>Shipping</span>
          </div>
          <div className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-brand-primary' : 'bg-gray-200'}`}></div>
          <div className={`flex flex-col items-center ${step >= 2 ? 'text-brand-primary' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step >= 2 ? 'bg-brand-primary text-white' : 'bg-gray-200'}`}>
              2
            </div>
            <span>Review</span>
          </div>
          <div className={`flex-1 h-1 mx-4 ${step >= 3 ? 'bg-brand-primary' : 'bg-gray-200'}`}></div>
          <div className={`flex flex-col items-center ${step >= 3 ? 'text-brand-primary' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${step >= 3 ? 'bg-brand-primary text-white' : 'bg-gray-200'}`}>
              3
            </div>
            <span>Payment</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <div className="lg:col-span-2">
          {/* Step 1: Shipping Information */}
          {step === 1 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
              <form
                className="space-y-6" 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (validateShippingInfo()) {
                    setStep(2);
                    window.scrollTo(0, 0);
                  }
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField name="firstName" label="First Name" />
                  <FormField name="lastName" label="Last Name" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField name="email" label="Email" type="email" />
                  <FormField
                    name="phone" 
                    label="Phone"
                    type="tel"
                    hint="10-digit number"
                    placeholder="10-digit number without spaces"
                  />
                </div>

                <FormField name="address" label="Address" />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="col-span-2">
                    <FormField name="city" label="City" />
                  </div>
                  <FormField name="state" label="State" />
                  <FormField name="zipCode" label="PIN Code" hint="6-digit" />
                </div>

                <FormField
                  name="country" 
                  label="Country"
                  type="select"
                  options={[
                    { value: 'India', label: 'India' },
                    { value: 'United States', label: 'United States' },
                    { value: 'United Kingdom', label: 'United Kingdom' },
                    { value: 'Canada', label: 'Canada' },
                    { value: 'Australia', label: 'Australia' }
                  ]}
                />

                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    className="bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
                  >
                    Continue to Review
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 2: Order Review */}
          {step === 2 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Review Your Order</h2>

              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Shipping Address</h3>
                <div className="bg-gray-50 p-4 rounded">
                  <p>
                    {formData.firstName} {formData.lastName}<br />
                    {formData.address}<br />
                    {formData.city}, {formData.state} {formData.zipCode}<br />
                    {formData.country}<br />
                    {formData.email}<br />
                    {formData.phone}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-700 mb-2">Order Items</h3>
                <div className="space-y-4">
                  {Array.isArray(cartItems) && cartItems.map((item) => (
                    <div key={item.id} className="flex items-center border-b pb-4">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={getImageSrc(item)}
                          alt={item.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="ml-4 flex-grow">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <div className="ml-4 text-right">
                        <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={handleBackToShipping}
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors"
                >
                  Back to Shipping
                </button>
                <button
                  onClick={handleContinueToPayment}
                  className="bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
                >
                  Continue to Payment
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment Method */}
          {step === 3 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4 cursor-pointer" onClick={() => handlePaymentMethodChange('cod')}>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="cod"
                      name="paymentMethod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => { }}
                      className="w-4 h-4 text-brand-primary"
                    />
                    <label htmlFor="cod" className="ml-2 cursor-pointer flex-grow">
                      <div className="font-medium">Cash on Delivery</div>
                      <div className="text-sm text-gray-500">Pay when you receive the package</div>
                    </label>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 cursor-pointer opacity-50" onClick={() => toast.error('This payment method is not available yet')}>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="card"
                      name="paymentMethod"
                      checked={false}
                      onChange={() => { }}
                      disabled
                      className="w-4 h-4 text-brand-primary"
                    />
                    <label htmlFor="card" className="ml-2 cursor-pointer flex-grow">
                      <div className="font-medium">Credit/Debit Card</div>
                      <div className="text-sm text-gray-500">Coming soon</div>
                    </label>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 cursor-pointer opacity-50" onClick={() => toast.error('This payment method is not available yet')}>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="upi"
                      name="paymentMethod"
                      checked={false}
                      onChange={() => { }}
                      disabled
                      className="w-4 h-4 text-brand-primary"
                    />
                    <label htmlFor="upi" className="ml-2 cursor-pointer flex-grow">
                      <div className="font-medium">UPI</div>
                      <div className="text-sm text-gray-500">Coming soon</div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-700 mb-2">Order Summary</h3>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Shipping:</span>
                  <span>{cartTotal > 10000 ? 'Free' : formatPrice(100)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Tax (18%):</span>
                  <span>{formatPrice(cartTotal * 0.18)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-gray-200">
                  <span>Total:</span>
                  <span>{formatPrice(cartTotal + (cartTotal > 10000 ? 0 : 100) + (cartTotal * 0.18))}</span>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={handleBackToReview}
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors"
                >
                  Back to Review
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className={`bg-black text-white px-8 py-3 rounded-md font-medium transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-gray-800'}`}
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 h-fit">
          <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
          <div className="max-h-60 overflow-y-auto mb-4 space-y-4">
            {Array.isArray(cartItems) && cartItems.map((item) => (
              <div key={item.id} className="flex justify-between">
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span>{cartTotal > 10000 ? 'Free' : formatPrice(100)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span>{formatPrice(cartTotal * 0.18)}</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{formatPrice(cartTotal + (cartTotal > 10000 ? 0 : 100) + (cartTotal * 0.18))}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}