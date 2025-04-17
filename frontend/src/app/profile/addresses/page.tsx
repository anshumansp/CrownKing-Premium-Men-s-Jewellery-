'use client';

import { useState, useEffect } from 'react';
import { Address } from '@/types';
import { addressService } from '@/services/addressService';
import AddressForm from './AddressForm';

export default function Addresses() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    // Fetch addresses
    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                setIsLoading(true);
                const data = await addressService.getAddresses();
                // Check if data is an array, otherwise use empty array
                setAddresses(Array.isArray(data) ? data : []);
            } catch (err) {
                setError('Failed to load addresses');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAddresses();
    }, []);

    const handleAddNew = () => {
        setEditingAddress(null);
        setShowForm(true);
    };

    const handleEdit = (address: Address) => {
        setEditingAddress(address);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this address?')) {
            return;
        }

        try {
            await addressService.deleteAddress(id);
            setAddresses(addresses.filter(address => address.id !== id));
            setMessage('Address deleted successfully');
            setIsError(false);
        } catch (err) {
            setMessage(err instanceof Error ? err.message : 'Failed to delete address');
            setIsError(true);
        }
    };

    const handleSetDefault = async (id: string, type: 'shipping' | 'billing') => {
        try {
            await addressService.setDefaultAddress(id, type);

            // Update local state
            setAddresses(addresses.map(address => {
                if (address.type === type) {
                    return { ...address, isDefault: address.id === id };
                }
                return address;
            }));

            setMessage(`Address set as default ${type} address`);
            setIsError(false);
        } catch (err) {
            setMessage(err instanceof Error ? err.message : 'Failed to set as default');
            setIsError(true);
        }
    };

    const handleFormSubmit = async (formData: Omit<Address, 'id' | 'userId'>) => {
        try {
            if (editingAddress) {
                // Update existing address
                const updated = await addressService.updateAddress(editingAddress.id, formData);
                setAddresses(addresses.map(address =>
                    address.id === editingAddress.id ? updated : address
                ));
                setMessage('Address updated successfully');
            } else {
                // Create new address
                const newAddress = await addressService.createAddress(formData);
                setAddresses([...addresses, newAddress]);
                setMessage('Address added successfully');
            }

            setIsError(false);
            setShowForm(false);
            setEditingAddress(null);
        } catch (err) {
            setMessage(err instanceof Error ? err.message : 'Failed to save address');
            setIsError(true);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingAddress(null);
    };

    if (isLoading) {
        return (
            <div className="min-h-[300px] flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 text-red-700 rounded-md">
                {error}
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Addresses</h1>
                {!showForm && (
                    <button
                        onClick={handleAddNew}
                        className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                    >
                        Add New Address
                    </button>
                )}
            </div>

            {message && (
                <div className={`mb-6 p-4 border rounded-md ${isError ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
                    {message}
                </div>
            )}

            {showForm ? (
                <AddressForm
                    initialData={editingAddress}
                    onSubmit={handleFormSubmit}
                    onCancel={handleCancel}
                />
            ) : (
                <>
                    {!addresses || addresses.length === 0 ? (
                        <div className="text-center py-10 border border-gray-200 rounded-md">
                            <p className="text-gray-500 mb-4">You don't have any saved addresses yet.</p>
                            <button
                                onClick={handleAddNew}
                                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                            >
                                Add Your First Address
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-lg font-semibold mb-4">Shipping Addresses</h2>
                                <div className="space-y-4">
                                    {addresses
                                        .filter(address => address.type === 'shipping')
                                        .map(address => (
                                            <AddressCard
                                                key={address.id}
                                                address={address}
                                                onEdit={handleEdit}
                                                onDelete={handleDelete}
                                                onSetDefault={handleSetDefault}
                                            />
                                        ))}
                                </div>
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold mb-4">Billing Addresses</h2>
                                <div className="space-y-4">
                                    {addresses
                                        .filter(address => address.type === 'billing')
                                        .map(address => (
                                            <AddressCard
                                                key={address.id}
                                                address={address}
                                                onEdit={handleEdit}
                                                onDelete={handleDelete}
                                                onSetDefault={handleSetDefault}
                                            />
                                        ))}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

interface AddressCardProps {
    address: Address;
    onEdit: (address: Address) => void;
    onDelete: (id: string) => void;
    onSetDefault: (id: string, type: 'shipping' | 'billing') => void;
}

function AddressCard({ address, onEdit, onDelete, onSetDefault }: AddressCardProps) {
    return (
        <div className="border border-gray-200 rounded-md p-4 relative">
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-medium">{address.firstName} {address.lastName}</h3>
                        {address.isDefault && (
                            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Default</span>
                        )}
                    </div>
                    <p className="text-gray-600 text-sm">{address.address}</p>
                    <p className="text-gray-600 text-sm">{address.city}, {address.state} {address.zipCode}</p>
                    <p className="text-gray-600 text-sm">{address.country}</p>
                    <p className="text-gray-600 text-sm">Phone: {address.phone}</p>
                </div>

                <div className="flex space-x-2">
                    <button
                        onClick={() => onEdit(address)}
                        className="px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors text-sm"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(address.id)}
                        className="px-3 py-1 bg-gray-100 text-red-600 rounded hover:bg-gray-200 transition-colors text-sm"
                    >
                        Delete
                    </button>
                </div>
            </div>

            {!address.isDefault && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <button
                        onClick={() => onSetDefault(address.id, address.type)}
                        className="text-sm text-gray-600 hover:text-black"
                    >
                        Set as default {address.type} address
                    </button>
                </div>
            )}
        </div>
    );
} 