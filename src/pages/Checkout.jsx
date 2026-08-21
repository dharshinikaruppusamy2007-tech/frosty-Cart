import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, Tag, CreditCard, ShoppingBag, AlertTriangle, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL;

const Checkout = () => {
    const navigate = useNavigate();
    const { cart, cartTotal } = useCart();
    const { token, user } = useAuth();

    const [address, setAddress] = useState({
        fullName: user?.name || '',
        phone: user?.phone || '',
        address: '',
        city: '',
        state: '',
        pincode: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
    const [couponCode, setCouponCode] = useState('');
    const [couponResult, setCouponResult] = useState(null);
    const [couponError, setCouponError] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!cart.items || cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-[#FFF8F0] py-16 px-4">
                <div className="max-w-2xl mx-auto text-center bg-white rounded-3xl p-12 shadow-xl border border-[#F5E6D3]">
                    <div className="text-6xl mb-6">{'\uD83D\uDED2'}</div>
                    <h2 className="text-2xl font-display font-bold text-gray-900 mb-3">Your cart is empty</h2>
                    <p className="text-gray-500 mb-8">Add some ice creams before checking out.</p>
                    <Link to="/products" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#9B59B6] to-[#E74C8B] text-white rounded-full font-bold text-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all">
                        <ShoppingBag size={20} />
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    const handleAddressChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const handleApplyCoupon = async () => {
        setCouponError('');
        setCouponResult(null);
        if (!couponCode.trim()) return;
        try {
            const res = await fetch(`${API}/api/orders/coupons/validate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ code: couponCode.trim(), subtotal: cartTotal })
            });
            const data = await res.json();
            if (res.ok && data.valid) {
                setCouponResult(data);
            } else {
                setCouponError(data.message || 'Invalid coupon code');
            }
        } catch (err) {
            setCouponError('Failed to validate coupon');
        }
    };

    const handleRemoveCoupon = () => {
        setCouponCode('');
        setCouponResult(null);
        setCouponError('');
    };

    const deliveryCharge = cartTotal >= 500 ? 0 : 50;
    const discount = couponResult ? couponResult.discount : 0;
    const finalAmount = cartTotal - discount + deliveryCharge;

    const handlePlaceOrder = async () => {
        setError('');
        if (!address.fullName || !address.phone || !address.address || !address.city || !address.state || !address.pincode) {
            setError('Please fill all delivery address fields');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`${API}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    deliveryAddress: address,
                    paymentMethod,
                    couponCode: couponResult ? couponResult.code : null
                })
            });
            const data = await res.json();
            if (res.ok) {
                navigate(`/payment/${data.orderId}`);
            } else {
                setError(data.message || 'Failed to place order');
            }
        } catch (err) {
            setError('Server error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFF8F0] py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-8">
                    <span className="text-gradient">Checkout</span>
                </h1>

                {error && (
                    <div className="mb-6 bg-red-50 text-red-500 p-4 rounded-2xl font-medium border border-red-100 flex items-center gap-2">
                        <AlertTriangle size={18} />
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Delivery Address */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#F5E6D3]">
                            <div className="flex items-center gap-2 mb-6">
                                <MapPin size={20} className="text-[#9B59B6]" />
                                <h3 className="font-display font-bold text-xl text-gray-800">Delivery Address</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input name="fullName" type="text" value={address.fullName} onChange={handleAddressChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent outline-none transition-all"
                                        placeholder="John Doe" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input name="phone" type="tel" value={address.phone} onChange={handleAddressChange}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent outline-none transition-all"
                                        placeholder="9876543210" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <textarea name="address" value={address.address} onChange={handleAddressChange} rows={3}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent outline-none transition-all resize-none"
                                        placeholder="123 Main Street, Apt 4B" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                        <input name="city" type="text" value={address.city} onChange={handleAddressChange}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent outline-none transition-all"
                                            placeholder="Chennai" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                        <input name="state" type="text" value={address.state} onChange={handleAddressChange}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent outline-none transition-all"
                                            placeholder="Tamil Nadu" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                                        <input name="pincode" type="text" value={address.pincode} onChange={handleAddressChange}
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent outline-none transition-all"
                                            placeholder="600001" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#F5E6D3]">
                            <h3 className="font-display font-bold text-xl text-gray-800 mb-4">Order Summary</h3>
                            <div className="space-y-3">
                                {cart.items.filter(i => i.product).map(item => (
                                    <div key={item.product._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <img src={item.product.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                                            <div>
                                                <p className="font-medium text-sm text-gray-800">{item.product.name}</p>
                                                <p className="text-gray-500 text-xs">{'\u20B9'}{item.product.price} {'\u00D7'} {item.quantity}</p>
                                            </div>
                                        </div>
                                        <span className="font-medium text-sm text-gray-800">{'\u20B9'}{(item.product.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#F5E6D3]">
                            <div className="flex items-center gap-2 mb-4">
                                <CreditCard size={20} className="text-[#9B59B6]" />
                                <h3 className="font-display font-bold text-xl text-gray-800">Payment Method</h3>
                            </div>
                            <div className="space-y-3">
                                {['Cash on Delivery', 'Online Payment'].map(method => (
                                    <label key={method} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === method ? 'border-[#9B59B6] bg-[#FFF8F0]' : 'border-gray-200 hover:border-gray-300'}`}>
                                        <input type="radio" name="payment" value={method} checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} className="text-[#9B59B6] focus:ring-[#9B59B6]" />
                                        <span className="font-medium text-gray-800">{method}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#F5E6D3] sticky top-28">
                            {/* Coupon */}
                            <div className="mb-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <Tag size={18} className="text-[#9B59B6]" />
                                    <h4 className="font-display font-bold text-gray-800">Coupon Code</h4>
                                </div>
                                {couponResult ? (
                                    <div className="bg-green-50 text-green-600 p-3 rounded-xl text-sm font-medium border border-green-100 flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <CheckCircle size={16} />
                                            {couponResult.code} applied ({couponResult.discountPercent}% off)
                                        </span>
                                        <button onClick={handleRemoveCoupon} className="text-green-700 hover:text-red-500 font-bold text-xs">Remove</button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                            placeholder="Enter coupon"
                                            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent outline-none"
                                        />
                                        <button onClick={handleApplyCoupon} className="px-4 py-2 bg-[#9B59B6] text-white rounded-xl text-sm font-bold hover:bg-[#7D3C98] transition-colors">
                                            Apply
                                        </button>
                                    </div>
                                )}
                                {couponError && <p className="text-red-500 text-xs mt-2">{couponError}</p>}
                                <p className="text-gray-400 text-xs mt-2">Try: FROSTY10, WELCOME20, ICECREAM50</p>
                            </div>

                            <hr className="border-gray-100 mb-6" />

                            {/* Price Breakdown */}
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal ({cart.items.reduce((a, i) => a + i.quantity, 0)} items)</span>
                                    <span className="font-medium">{'\u20B9'}{cartTotal.toFixed(2)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount ({couponResult.code})</span>
                                        <span className="font-medium">-{'\u20B9'}{discount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery Charge</span>
                                    <span className="font-medium">
                                        {deliveryCharge === 0 ? (
                                            <span className="text-green-600">FREE</span>
                                        ) : (
                                            `₹${deliveryCharge.toFixed(2)}`
                                        )}
                                    </span>
                                </div>
                                {cartTotal < 500 && (
                                    <p className="text-xs text-gray-400">Add {'\u20B9'}{(500 - cartTotal).toFixed(0)} more for free delivery</p>
                                )}
                                <hr className="border-gray-100" />
                                <div className="flex justify-between font-display font-bold text-xl text-gray-900">
                                    <span>Final Amount</span>
                                    <span>{'\u20B9'}{finalAmount.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-[#9B59B6] to-[#E74C8B] text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50"
                            >
                                {loading ? 'Placing Order...' : 'Place Order'}
                            </button>

                            <Link to="/cart" className="block w-full text-center py-3 text-[#9B59B6] font-medium hover:underline mt-3">
                                Back to Cart
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
