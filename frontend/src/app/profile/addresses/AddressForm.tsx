'use client';

import { useState, useEffect } from 'react';
import { Address } from '@/types';

interface AddressFormProps {
    initialData: Address | null;
    onSubmit: (data: Omit<Address, 'id' | 'userId'>) => void;
    onCancel: () => void;
}

export default function AddressForm({ initialData, onSubmit, onCancel }: AddressFormProps) {
    const [formData, setFormData] = useState<Omit<Address, 'id' | 'userId'>>({
        type: 'shipping',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        phone: '',
        email: '',
        isDefault: false,
    });

    useEffect(() => {
        if (initialData) {
            const { id, userId, ...rest } = initialData;
            setFormData(rest);
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="border border-gray-200 rounded-md p-6">
            <h2 className="text-xl font-semibold mb-6">{initialData ? 'Edit Address' : 'Add New Address'}</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex gap-6 items-center mb-6">
                    <label className="text-gray-700 flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="type"
                            value="shipping"
                            checked={formData.type === 'shipping'}
                            onChange={handleChange}
                            className="text-black focus:ring-black h-4 w-4"
                        />
                        Shipping Address
                    </label>

                    <label className="text-gray-700 flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="type"
                            value="billing"
                            checked={formData.type === 'billing'}
                            onChange={handleChange}
                            className="text-black focus:ring-black h-4 w-4"
                        />
                        Billing Address
                    </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                            First Name
                        </label>
                        <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name
                        </label>
                        <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address
                    </label>
                    <input
                        id="address"
                        name="address"
                        type="text"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                            City
                        </label>
                        <input
                            id="city"
                            name="city"
                            type="text"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                            State / Province
                        </label>
                        <input
                            id="state"
                            name="state"
                            type="text"
                            value={formData.state}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                            ZIP / Postal Code
                        </label>
                        <input
                            id="zipCode"
                            name="zipCode"
                            type="text"
                            value={formData.zipCode}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                    </label>
                    <input
                        id="country"
                        name="country"
                        type="text"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                    </label>
                    <input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email (Optional)
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:border-black focus:ring-1 focus:ring-black focus:outline-none"
                    />
                </div>

                <div className="flex items-center">
                    <input
                        id="isDefault"
                        name="isDefault"
                        type="checkbox"
                        checked={formData.isDefault}
                        onChange={handleChange}
                        className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                    />
                    <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">
                        Set as default {formData.type} address
                    </label>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                    >
                        {initialData ? 'Update Address' : 'Save Address'}
                    </button>
                </div>
            </form>
        </div>
    );
} 