import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { CreditCard, Lock, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

const Payment = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const { clearCart } = useCart();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [cardName, setCardName] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(`${API}/api/orders/${orderId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setOrder(data);
                    if (data.paymentStatus === 'Paid') {
                        clearCart();
                        navigate(`/order-confirmed/${orderId}`);
                    }
                } else {
                    setError('Order not found');
                }
            } catch (err) {
                setError('Failed to load order');
            } finally {
                setLoading(false);
            }
        };
        if (token) fetchOrder();
    }, [orderId, token, navigate, clearCart]);

    const formatCardNumber = (val) => {
        const cleaned = val.replace(/\D/g, '').slice(0, 16);
        return cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    };

    const formatExpiry = (val) => {
        const cleaned = val.replace(/\D/g, '').slice(0, 4);
        if (cleaned.length >= 3) return cleaned.slice(0, 2) + '/' + cleaned.slice(2);
        return cleaned;
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        setError('');

        if (order.paymentMethod === 'Online Payment') {
            if (!cardNumber.replace(/\s/g, '') || cardNumber.replace(/\s/g, '').length < 16) {
                setError('Enter a valid card number');
                return;
            }
            if (!expiry || expiry.length < 5) {
                setError('Enter a valid expiry date');
                return;
            }
            if (!cvv || cvv.length < 3) {
                setError('Enter a valid CVV');
                return;
            }
            if (!cardName.trim()) {
                setError('Enter the name on card');
                return;
            }
        }

        setProcessing(true);
        try {
            const body = order.paymentMethod === 'Online Payment'
                ? { cardNumber: cardNumber.replace(/\s/g, ''), expiry, cvv }
                : {};

            const res = await fetch(`${API}/api/payments/${orderId}/process`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(body)
            });

            const data = await res.json();
            if (res.ok && data.success) {
                setSuccess(true);
                clearCart();
                setTimeout(() => {
                    navigate(`/order-confirmed/${orderId}`);
                }, 1500);
            } else {
                setError(data.message || 'Payment failed');
            }
        } catch (err) {
            setError('Payment processing failed. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
                <div className="text-6xl animate-spin">{'\uD83C\uDF66'}</div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
                <div className="bg-white rounded-3xl p-12 shadow-xl border border-[#F5E6D3] text-center max-w-md">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} className="text-green-500" />
                    </div>
                    <h2 className="text-2xl font-display font-bold text-gray-900 mb-2">Payment Successful!</h2>
                    <p className="text-gray-500">Redirecting to your order confirmation...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">Order not found</p>
                    <Link to="/" className="text-[#9B59B6] font-bold hover:underline">Go Home</Link>
                </div>
            </div>
        );
    }

    const isCOD = order.paymentMethod === 'Cash on Delivery';

    return (
        <div className="min-h-screen bg-[#FFF8F0] py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <Link to="/cart" className="inline-flex items-center gap-2 text-[#9B59B6] font-medium hover:underline mb-6">
                    <ArrowLeft size={18} /> Back to Cart
                </Link>

                <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-8">
                    <span className="text-gradient">Payment</span>
                </h1>

                {error && (
                    <div className="mb-6 bg-red-50 text-red-500 p-4 rounded-2xl font-medium border border-red-100 flex items-center gap-2">
                        <AlertTriangle size={18} />
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#F5E6D3]">
                            <div className="flex items-center gap-2 mb-6">
                                <CreditCard size={20} className="text-[#9B59B6]" />
                                <h3 className="font-display font-bold text-xl text-gray-800">
                                    {isCOD ? 'Confirm Cash on Delivery' : 'Card Details'}
                                </h3>
                            </div>

                            {isCOD ? (
                                <div>
                                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                                        <p className="text-amber-700 text-sm font-medium">
                                            You have selected <strong>Cash on Delivery</strong>. Please keep {'\u20B9'}{order.totalAmount.toFixed(2)} ready at the time of delivery.
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                        <p className="text-sm text-gray-600 mb-2">Order ID: <span className="font-mono font-bold text-[#9B59B6]">{order.orderId}</span></p>
                                        <p className="text-lg font-bold text-gray-900">Total to Pay: {'\u20B9'}{order.totalAmount.toFixed(2)}</p>
                                    </div>

                                    <button
                                        onClick={handlePayment}
                                        disabled={processing}
                                        className="w-full py-4 bg-gradient-to-r from-[#9B59B6] to-[#E74C8B] text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50"
                                    >
                                        {processing ? 'Confirming...' : 'Confirm Order'}
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handlePayment}>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                                            <input
                                                type="text"
                                                value={cardName}
                                                onChange={(e) => setCardName(e.target.value)}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent outline-none transition-all"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                                            <input
                                                type="text"
                                                value={cardNumber}
                                                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent outline-none transition-all font-mono"
                                                placeholder="1234 5678 9012 3456"
                                                maxLength={19}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                                                <input
                                                    type="text"
                                                    value={expiry}
                                                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent outline-none transition-all font-mono"
                                                    placeholder="MM/YY"
                                                    maxLength={5}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                                                <input
                                                    type="password"
                                                    value={cvv}
                                                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent outline-none transition-all font-mono"
                                                    placeholder="***"
                                                    maxLength={4}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 mt-4 mb-6 text-sm text-gray-500">
                                        <Lock size={14} />
                                        <span>This is a simulated payment. No real charges will be made.</span>
                                    </div>

                                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                        <p className="text-sm text-gray-600 mb-1">Order ID: <span className="font-mono font-bold text-[#9B59B6]">{order.orderId}</span></p>
                                        <p className="text-lg font-bold text-gray-900">Amount to Pay: {'\u20B9'}{order.totalAmount.toFixed(2)}</p>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full py-4 bg-gradient-to-r from-[#9B59B6] to-[#E74C8B] text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50"
                                    >
                                        {processing ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <span className="animate-spin">{'\u23F3'}</span> Processing Payment...
                                            </span>
                                        ) : (
                                            `Pay {'\u20B9'}${order.totalAmount.toFixed(2)}`
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#F5E6D3] sticky top-28">
                            <h4 className="font-display font-bold text-gray-800 mb-4">Order Summary</h4>
                            <div className="space-y-3 mb-4">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                        {item.image && <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm text-gray-800 truncate">{item.name}</p>
                                            <p className="text-gray-500 text-xs">{'\u20B9'}{item.price} x {item.quantity}</p>
                                        </div>
                                        <span className="font-medium text-sm whitespace-nowrap">{'\u20B9'}{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            <hr className="border-gray-100 mb-4" />

                            <div className="space-y-2">
                                <div className="flex justify-between text-gray-600 text-sm">
                                    <span>Subtotal</span>
                                    <span>{'\u20B9'}{order.subtotal.toFixed(2)}</span>
                                </div>
                                {order.discount > 0 && (
                                    <div className="flex justify-between text-green-600 text-sm">
                                        <span>Discount ({order.couponCode})</span>
                                        <span>-{'\u20B9'}{order.discount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-600 text-sm">
                                    <span>Delivery</span>
                                    <span>{order.deliveryCharge === 0 ? <span className="text-green-600 font-medium">FREE</span> : `₹${order.deliveryCharge.toFixed(2)}`}</span>
                                </div>
                                <hr className="border-gray-100" />
                                <div className="flex justify-between font-display font-bold text-lg text-gray-900">
                                    <span>Total</span>
                                    <span>{'\u20B9'}{order.totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;
