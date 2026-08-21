import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminOrderDetails = () => {
    const { token } = useAuth();
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState('');

    const statuses = ['Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/orders/${orderId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setOrder(data);
                    setStatus(data.orderStatus);
                }
            } catch (err) {
                console.error('Failed to fetch order');
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId, token]);

    const handleUpdateStatus = async () => {
        setUpdating(true);
        setMessage('');

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });

            if (res.ok) {
                const updated = await res.json();
                setOrder(updated);
                setMessage('Order status updated successfully.');
            } else {
                const data = await res.json();
                setMessage(data.message || 'Failed to update status');
            }
        } catch (err) {
            setMessage('Server error');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-4xl animate-spin text-purple-600">&#10052;</div>
            </div>
        );
    }

    if (!order) {
        return <div className="text-center py-20 text-gray-500">Order not found</div>;
    }

    return (
        <div>
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate('/admin/orders')} className="text-gray-600 hover:text-gray-800 text-xl">&#8592;</button>
                <h1 className="text-2xl font-bold text-gray-800">Order {order.orderId}</h1>
            </div>

            {message && (
                <div className={`px-4 py-3 rounded-lg mb-4 text-sm ${
                    message.includes('success') ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
                }`}>{message}</div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h3>
                        <div className="space-y-3">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
                                    <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-800">{item.name}</p>
                                        <p className="text-xs text-gray-500">Qty: {item.quantity} x Rs.{item.price}</p>
                                    </div>
                                    <p className="text-sm font-semibold text-gray-800">Rs.{item.price * item.quantity}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Subtotal</span>
                                <span>Rs.{order.subtotal}</span>
                            </div>
                            {order.discount > 0 && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>Discount {order.couponCode ? `(${order.couponCode})` : ''}</span>
                                    <span>-Rs.{order.discount}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Delivery</span>
                                <span>{order.deliveryCharge === 0 ? 'FREE' : `Rs.${order.deliveryCharge}`}</span>
                            </div>
                            <div className="flex justify-between text-base font-bold text-gray-800 border-t border-gray-100 pt-2">
                                <span>Total</span>
                                <span>Rs.{order.totalAmount}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Delivery Address</h3>
                        <div className="text-sm text-gray-600 space-y-1">
                            <p className="font-medium text-gray-800">{order.deliveryAddress.fullName}</p>
                            <p>{order.deliveryAddress.phone}</p>
                            <p>{order.deliveryAddress.address}</p>
                            <p>{order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer</h3>
                        <div className="text-sm text-gray-600 space-y-1">
                            <p className="font-medium text-gray-800">{order.user?.name || 'N/A'}</p>
                            <p>{order.user?.email || 'N/A'}</p>
                            <p>{order.user?.phone || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment</h3>
                        <div className="text-sm text-gray-600 space-y-2">
                            <div className="flex justify-between">
                                <span>Method</span>
                                <span className="font-medium text-gray-800">{order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Status</span>
                                <span className={`font-medium ${order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                                    {order.paymentStatus}
                                </span>
                            </div>
                            {order.transactionId && (
                                <div className="flex justify-between">
                                    <span>Transaction ID</span>
                                    <span className="font-medium text-gray-800 text-xs">{order.transactionId}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span>Date</span>
                                <span className="text-gray-800">{new Date(order.createdAt).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Update Status</h3>
                        <select value={status} onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none mb-3">
                            {statuses.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                        <button onClick={handleUpdateStatus} disabled={updating || status === order.orderStatus}
                            className="w-full bg-purple-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition disabled:opacity-50">
                            {updating ? 'Updating...' : 'Update Status'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOrderDetails;
