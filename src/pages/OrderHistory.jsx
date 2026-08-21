import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Package, MapPin, CreditCard, Calendar, ShoppingBag, ChevronDown, ChevronUp, Tag, Download } from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

const statusColors = {
    Confirmed: 'bg-blue-100 text-blue-700',
    Processing: 'bg-yellow-100 text-yellow-700',
    Shipped: 'bg-purple-100 text-purple-700',
    Delivered: 'bg-green-100 text-green-700',
    Cancelled: 'bg-red-100 text-red-700'
};

const paymentStatusColors = {
    Pending: 'bg-amber-100 text-amber-700',
    Paid: 'bg-green-100 text-green-700',
    Failed: 'bg-red-100 text-red-700',
    Refunded: 'bg-blue-100 text-blue-700'
};

const OrderHistory = () => {
    const { token } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);

    const handleDownloadInvoice = async (orderId) => {
        try {
            const res = await fetch(`${API}/api/payments/${orderId}/invoice`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch invoice');
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `invoice-${orderId}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Invoice download failed', err);
        }
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch(`${API}/api/orders`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) setOrders(await res.json());
            } catch (err) {
                console.error('Failed to fetch orders', err);
            } finally {
                setLoading(false);
            }
        };
        if (token) fetchOrders();
    }, [token]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
                <div className="text-6xl animate-spin">{'\uD83C\uDF66'}</div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-screen bg-[#FFF8F0] py-16 px-4">
                <div className="max-w-2xl mx-auto text-center bg-white rounded-3xl p-12 shadow-xl border border-[#F5E6D3]">
                    <div className="text-6xl mb-6">{'\uD83D\uDCE6'}</div>
                    <h2 className="text-2xl font-display font-bold text-gray-900 mb-3">No orders yet</h2>
                    <p className="text-gray-500 mb-8">Start shopping to place your first order!</p>
                    <Link to="/products" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#9B59B6] to-[#E74C8B] text-white rounded-full font-bold text-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all">
                        <ShoppingBag size={20} />
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FFF8F0] py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-8">My <span className="text-gradient">Orders</span></h1>

                <div className="space-y-6">
                    {orders.map(order => {
                        const isExpanded = expandedOrder === order._id;
                        return (
                            <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-[#F5E6D3] overflow-hidden">
                                <div className="p-6">
                                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                        <div>
                                            <p className="font-mono font-bold text-sm text-[#9B59B6] mb-1">#{order.orderId}</p>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Calendar size={14} />
                                                {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[order.orderStatus] || 'bg-gray-100 text-gray-700'}`}>
                                            {order.orderStatus}
                                        </span>
                                        {order.paymentStatus && (
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${paymentStatusColors[order.paymentStatus] || 'bg-gray-100 text-gray-700'}`}>
                                                {order.paymentStatus === 'Paid' ? 'Paid' : order.paymentStatus === 'Pending' ? 'Payment Pending' : order.paymentStatus}
                                            </span>
                                        )}
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                                {item.image && <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm text-gray-800">{item.name}</p>
                                                    <p className="text-gray-500 text-xs">{'\u20B9'}{item.price} x {item.quantity}</p>
                                                </div>
                                                <span className="font-medium text-sm">{'\u20B9'}{(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                                        <div className="flex items-start gap-2">
                                            <MapPin size={16} className="text-[#9B59B6] mt-0.5 shrink-0" />
                                            <div className="text-xs text-gray-600">
                                                <p className="font-medium">{order.deliveryAddress.fullName}</p>
                                                <p>{order.deliveryAddress.city}, {order.deliveryAddress.state}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <CreditCard size={16} className="text-[#9B59B6] mt-0.5 shrink-0" />
                                            <div className="text-xs text-gray-600">
                                                <p className="font-medium">{order.paymentMethod}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Package size={16} className="text-[#9B59B6] mt-0.5 shrink-0" />
                                            <div className="text-xs text-gray-600">
                                                <p>Total: <span className="font-bold text-gray-800">{'\u20B9'}{order.totalAmount.toFixed(2)}</span></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                                    className="w-full px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-2 text-sm font-medium text-[#9B59B6] hover:bg-[#FFF8F0] transition-colors">
                                    <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
                                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>

                                {isExpanded && (
                                    <div className="px-6 pb-6 space-y-4 border-t border-gray-100 pt-4">
                                        <div>
                                            <h4 className="font-display font-bold text-sm text-gray-800 mb-2">Order ID</h4>
                                            <p className="text-sm text-gray-600 font-mono">{order.orderId}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-display font-bold text-sm text-gray-800 mb-2">Delivery Address</h4>
                                            <div className="text-sm text-gray-600 space-y-0.5">
                                                <p className="font-medium">{order.deliveryAddress.fullName}</p>
                                                <p>{order.deliveryAddress.phone}</p>
                                                <p>{order.deliveryAddress.address}</p>
                                                <p>{order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.pincode}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-display font-bold text-sm text-gray-800 mb-2">Price Details</h4>
                                            <div className="text-sm space-y-1">
                                                <div className="flex justify-between text-gray-600">
                                                    <span>Subtotal</span>
                                                    <span>{'\u20B9'}{order.subtotal.toFixed(2)}</span>
                                                </div>
                                                {order.discount > 0 && (
                                                    <div className="flex justify-between text-green-600">
                                                        <span className="flex items-center gap-1"><Tag size={12} /> Discount ({order.couponCode})</span>
                                                        <span>-{'\u20B9'}{order.discount.toFixed(2)}</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between text-gray-600">
                                                    <span>Delivery</span>
                                                    <span>{order.deliveryCharge === 0 ? <span className="text-green-600 font-medium">FREE</span> : `₹${order.deliveryCharge.toFixed(2)}`}</span>
                                                </div>
                                                <hr className="border-gray-100" />
                                                <div className="flex justify-between font-bold text-gray-900">
                                                    <span>Final Amount</span>
                                                    <span>{'\u20B9'}{order.totalAmount.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="font-display font-bold text-sm text-gray-800 mb-1">Payment</h4>
                                            <p className="text-sm text-gray-600">{order.paymentMethod}</p>
                                            {order.paymentStatus && (
                                                <p className="text-sm mt-1">Status: <span className={`font-medium ${order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-amber-600'}`}>{order.paymentStatus}</span></p>
                                            )}
                                            {order.transactionId && (
                                                <p className="text-xs text-gray-500 font-mono mt-1">TXN: {order.transactionId}</p>
                                            )}
                                        </div>
                                        <div className="flex gap-3 pt-2">
                                            <button
                                                onClick={() => handleDownloadInvoice(order.orderId)}
                                                className="flex items-center gap-2 px-4 py-2 border-2 border-[#9B59B6] text-[#9B59B6] rounded-xl text-sm font-bold hover:bg-[#FFF8F0] transition-colors"
                                            >
                                                <Download size={14} />
                                                Invoice
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default OrderHistory;
