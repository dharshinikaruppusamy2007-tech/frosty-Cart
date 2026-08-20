import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminOrders = () => {
    const { token } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/admin/orders', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) setOrders(await res.json());
            } catch (err) {
                console.error('Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [token]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-green-100 text-green-700';
            case 'Shipped': return 'bg-blue-100 text-blue-700';
            case 'Processing': return 'bg-yellow-100 text-yellow-700';
            case 'Cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-4xl animate-spin text-purple-600">&#10052;</div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Orders</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Order ID</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Total</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Payment</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm font-medium text-purple-700">{order.orderId}</td>
                                    <td className="px-4 py-3 text-sm text-gray-800">{order.user?.name || 'N/A'}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-800">Rs.{order.totalAmount}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                            order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' :
                                            order.paymentStatus === 'Failed' ? 'bg-red-100 text-red-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {order.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                                            {order.orderStatus}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Link to={`/admin/orders/${order._id}`}
                                            className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                                            View Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {orders.length === 0 && (
                    <div className="text-center py-12 text-gray-500">No orders found</div>
                )}
            </div>
        </div>
    );
};

export default AdminOrders;
