import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AdminCustomers = () => {
    const { token } = useAuth();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/admin/customers', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) setCustomers(await res.json());
            } catch (err) {
                console.error('Failed to fetch customers');
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, [token]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-4xl animate-spin text-purple-600">&#10052;</div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Customers</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Phone</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Role</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {customers.map((customer) => (
                                <tr key={customer._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{customer.name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{customer.email}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{customer.phone}</td>
                                    <td className="px-4 py-3">
                                        <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                            {customer.role}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {new Date(customer.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {customers.length === 0 && (
                    <div className="text-center py-12 text-gray-500">No customers found</div>
                )}
            </div>
        </div>
    );
};

export default AdminCustomers;
