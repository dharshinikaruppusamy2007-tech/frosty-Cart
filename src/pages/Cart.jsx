import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, AlertTriangle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
    const { cart, cartTotal, updateQuantity, removeFromCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const deliveryCharge = 2.99;
    const [stockError, setStockError] = useState('');

    if (!user) {
        return (
            <div className="min-h-screen bg-[#FFF8F0] py-16 px-4">
                <div className="max-w-2xl mx-auto text-center bg-white rounded-3xl p-12 shadow-xl border border-[#F5E6D3]">
                    <div className="text-6xl mb-6">🔒</div>
                    <h2 className="text-2xl font-display font-bold text-gray-900 mb-3">Please login to view your cart</h2>
                    <p className="text-gray-500 mb-8">You need to be logged in to access your cart.</p>
                    <Link
                        to="/login"
                        state={{ from: '/cart' }}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#9B59B6] to-[#E74C8B] text-white rounded-full font-bold text-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                    >
                        Login
                    </Link>
                </div>
            </div>
        );
    }

    if (!cart.items || cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-[#FFF8F0] py-16 px-4">
                <div className="max-w-2xl mx-auto text-center bg-white rounded-3xl p-12 shadow-xl border border-[#F5E6D3]">
                    <div className="text-6xl mb-6">🛒</div>
                    <h2 className="text-2xl font-display font-bold text-gray-900 mb-3">Your cart is empty</h2>
                    <p className="text-gray-500 mb-8">Looks like you haven't added any ice creams yet.</p>
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#9B59B6] to-[#E74C8B] text-white rounded-full font-bold text-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                    >
                        <ShoppingBag size={20} />
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    const handleQuantityUpdate = async (productId, newQuantity, stock) => {
        if (newQuantity > stock) {
            setStockError(`Only ${stock} items are available.`);
            setTimeout(() => setStockError(''), 3000);
            return;
        }
        setStockError('');
        await updateQuantity(productId, newQuantity);
    };

    return (
        <div className="min-h-screen bg-[#FFF8F0] py-12 px-4">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-8">Shopping <span className="text-gradient">Cart</span></h1>

                {stockError && (
                    <div className="mb-6 bg-orange-50 text-orange-600 p-4 rounded-2xl font-medium border border-orange-100 flex items-center gap-2">
                        <AlertTriangle size={18} />
                        {stockError}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        {cart.items.map((item) => {
                            if (!item.product) return null;
                            const stock = item.product.stock || 0;
                            return (
                                <div key={item.product._id} className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-[#F5E6D3] flex gap-4 sm:gap-6 items-center">
                                    <img src={item.product.image} alt={item.product.name} className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl" />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-display font-bold text-lg text-gray-800 truncate">{item.product.name}</h3>
                                        <p className="text-[#9B59B6] font-bold text-lg">₹{item.product.price}</p>
                                        <div className="flex items-center gap-3 mt-2">
                                            <div className="flex items-center border border-gray-200 rounded-lg">
                                                <button
                                                    onClick={() => handleQuantityUpdate(item.product._id, Math.max(1, item.quantity - 1), stock)}
                                                    disabled={item.quantity <= 1}
                                                    className="p-2 hover:bg-gray-50 rounded-l-lg disabled:opacity-30 disabled:cursor-not-allowed"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="px-3 font-bold text-sm">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleQuantityUpdate(item.product._id, item.quantity + 1, stock)}
                                                    disabled={item.quantity >= stock}
                                                    className="p-2 hover:bg-gray-50 rounded-r-lg disabled:opacity-30 disabled:cursor-not-allowed"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            {item.quantity >= stock && stock > 0 && (
                                                <span className="text-xs text-orange-500 font-medium">Max stock</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col items-end gap-2">
                                        <p className="font-display font-bold text-lg text-gray-800">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                                        <button onClick={() => removeFromCart(item.product._id)} className="text-red-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#F5E6D3] sticky top-28">
                            <h3 className="font-display font-bold text-xl text-gray-800 mb-6">Order Summary</h3>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal ({cart.items.reduce((a, i) => a + i.quantity, 0)} items)</span>
                                    <span className="font-medium">₹{cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery Charge</span>
                                    <span className="font-medium">₹{deliveryCharge.toFixed(2)}</span>
                                </div>
                                <hr className="border-gray-100" />
                                <div className="flex justify-between font-display font-bold text-xl text-gray-900">
                                    <span>Total</span>
                                    <span>₹{(cartTotal + deliveryCharge).toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full py-4 bg-gradient-to-r from-[#9B59B6] to-[#E74C8B] text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all mb-3"
                            >
                                Proceed to Checkout
                            </button>

                            <Link
                                to="/products"
                                className="block w-full text-center py-3 text-[#9B59B6] font-medium hover:underline"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
