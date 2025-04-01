'use client'; // Mark as client component for form handling

import React, { useState } from 'react';
import Link from 'next/link';

// Placeholder data - in reality, this would come from cart state/API
const orderSummary = {
  subtotal: 289.49,
  shipping: 5.00,
  tax: 23.16,
  total: 317.65,
  items: [
    { id: 'ck1', name: "Men's Jewellery Item 1", price: 199.99, quantity: 1 },
    { id: 'ck3', name: "Men's Jewellery Item 3", price: 89.50, quantity: 2 },
  ]
};

const CheckoutPage: React.FC = () => {
  const [shippingInfo, setShippingInfo] = useState({
    name: '', address: '', city: '', state: '', zip: '', country: 'India'
  });
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [billingInfo, setBillingInfo] = useState({
    name: '', address: '', city: '', state: '', zip: '', country: 'India'
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '', expiryDate: '', cvv: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, section: 'shipping' | 'billing' | 'payment') => {
    const { name, value } = e.target;
    if (section === 'shipping') {
      setShippingInfo(prev => ({ ...prev, [name]: value }));
    } else if (section === 'billing') {
      setBillingInfo(prev => ({ ...prev, [name]: value }));
    } else {
      setPaymentInfo(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation (add more comprehensive validation)
    if (!shippingInfo.name || !shippingInfo.address || !shippingInfo.city || !shippingInfo.zip) {
        setError('Please fill in all required shipping fields.');
        setLoading(false);
        return;
    }
    if (!billingSameAsShipping && (!billingInfo.name || !billingInfo.address || !billingInfo.city || !billingInfo.zip)) {
        setError('Please fill in all required billing fields.');
        setLoading(false);
        return;
    }
     if (!paymentInfo.cardNumber || !paymentInfo.expiryDate || !paymentInfo.cvv) {
        setError('Please fill in all payment details.');
        setLoading(false);
        return;
    }

    // Placeholder for actual checkout logic (API call to process payment and create order)
    console.log('Placing order with:', {
      shipping: shippingInfo,
      billing: billingSameAsShipping ? shippingInfo : billingInfo,
      payment: paymentInfo, // In real app, only send tokenized payment info
      order: orderSummary
    });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Example: Handle success or error from API
    // setError('Payment failed. Please check your details.'); // Example error

    setLoading(false);
    // On success, redirect to an order confirmation page
    // router.push('/order-confirmation?orderId=12345');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-brand-dark-blue mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping & Payment Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Address */}
          <section className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h2 className="text-xl font-semibold text-brand-dark-blue mb-4">Shipping Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor="shipping-name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" id="shipping-name" name="name" required value={shippingInfo.name} onChange={(e) => handleInputChange(e, 'shipping')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-teal focus:border-brand-teal" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="shipping-address" className="block text-sm font-medium text-gray-700">Address</label>
                <input type="text" id="shipping-address" name="address" required value={shippingInfo.address} onChange={(e) => handleInputChange(e, 'shipping')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-teal focus:border-brand-teal" />
              </div>
              <div>
                <label htmlFor="shipping-city" className="block text-sm font-medium text-gray-700">City</label>
                <input type="text" id="shipping-city" name="city" required value={shippingInfo.city} onChange={(e) => handleInputChange(e, 'shipping')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-teal focus:border-brand-teal" />
              </div>
              <div>
                <label htmlFor="shipping-state" className="block text-sm font-medium text-gray-700">State / Province</label>
                <input type="text" id="shipping-state" name="state" required value={shippingInfo.state} onChange={(e) => handleInputChange(e, 'shipping')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-teal focus:border-brand-teal" />
              </div>
              <div>
                <label htmlFor="shipping-zip" className="block text-sm font-medium text-gray-700">ZIP / Postal Code</label>
                <input type="text" id="shipping-zip" name="zip" required value={shippingInfo.zip} onChange={(e) => handleInputChange(e, 'shipping')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-teal focus:border-brand-teal" />
              </div>
               <div>
                <label htmlFor="shipping-country" className="block text-sm font-medium text-gray-700">Country</label>
                <select id="shipping-country" name="country" value={shippingInfo.country} onChange={(e) => handleInputChange(e, 'shipping')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-teal focus:border-brand-teal bg-white">
                    <option>India</option>
                    <option>United States</option>
                    <option>Canada</option>
                    {/* Add other countries */}
                </select>
              </div>
            </div>
          </section>

          {/* Billing Address */}
          <section className="bg-white p-6 rounded-lg shadow border border-gray-200">
             <h2 className="text-xl font-semibold text-brand-dark-blue mb-4">Billing Address</h2>
             <div className="flex items-center mb-4">
                <input
                    id="billing-same"
                    name="billing-same"
                    type="checkbox"
                    checked={billingSameAsShipping}
                    onChange={(e) => setBillingSameAsShipping(e.target.checked)}
                    className="h-4 w-4 text-brand-teal focus:ring-brand-teal border-gray-300 rounded"
                />
                <label htmlFor="billing-same" className="ml-2 block text-sm text-gray-900">
                    Same as shipping address
                </label>
             </div>
             {!billingSameAsShipping && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Billing form fields similar to shipping */}
                     <div className="sm:col-span-2">
                        <label htmlFor="billing-name" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" id="billing-name" name="name" required={!billingSameAsShipping} value={billingInfo.name} onChange={(e) => handleInputChange(e, 'billing')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-teal focus:border-brand-teal" />
                    </div>
                    {/* ... other billing fields ... */}
                </div>
             )}
          </section>

          {/* Payment Details */}
          <section className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h2 className="text-xl font-semibold text-brand-dark-blue mb-4">Payment Details</h2>
            {/* Placeholder for Payment Gateway Integration (e.g., Stripe Elements) */}
            <div className="space-y-4">
                 <div>
                    <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">Card Number</label>
                    <input type="text" id="card-number" name="cardNumber" required placeholder="**** **** **** ****" value={paymentInfo.cardNumber} onChange={(e) => handleInputChange(e, 'payment')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-teal focus:border-brand-teal" />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="expiry-date" className="block text-sm font-medium text-gray-700">Expiry Date</label>
                        <input type="text" id="expiry-date" name="expiryDate" required placeholder="MM/YY" value={paymentInfo.expiryDate} onChange={(e) => handleInputChange(e, 'payment')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-teal focus:border-brand-teal" />
                    </div>
                    <div>
                        <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">CVV</label>
                        <input type="text" id="cvv" name="cvv" required placeholder="***" value={paymentInfo.cvv} onChange={(e) => handleInputChange(e, 'payment')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-brand-teal focus:border-brand-teal" />
                    </div>
                 </div>
                 <p className="text-xs text-gray-500 mt-2">Your payment information is secure.</p>
            </div>
          </section>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200 sticky top-24">
            <h2 className="text-xl font-semibold text-brand-dark-blue mb-6 border-b pb-3">Order Summary</h2>
            <div className="space-y-4 mb-6">
                {orderSummary.items.map(item => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                        <span>{item.name} (x{item.quantity})</span>
                        <span className="text-gray-600">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                ))}
            </div>
             <div className="space-y-2 mb-6 text-gray-700 border-t pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${orderSummary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${orderSummary.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${orderSummary.tax.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between font-semibold text-xl text-brand-dark-blue border-t pt-4">
                <span>Order total</span>
                <span>${orderSummary.total.toFixed(2)}</span>
              </div>

              {error && (
                <p className="text-sm text-red-600 text-center mt-4">{error}</p>
              )}

            <button
              type="submit"
              disabled={loading}
              className={`mt-6 w-full bg-brand-teal hover:bg-brand-dark-blue text-white font-semibold py-3 rounded-md transition duration-300 shadow-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
            <p className="text-xs text-gray-500 mt-4 text-center">
                By placing your order, you agree to our <Link href="/terms" className="underline hover:text-brand-teal">Terms of Service</Link>.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
