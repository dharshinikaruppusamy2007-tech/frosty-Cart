import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Package } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&q=80&w=600';

const Wishlist = () => {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { addToCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        return (
            <div className="min-h-screen bg-[#FFF8F0] py-16 px-4">
                <div className="max-w-2xl mx-auto text-center bg-white rounded-3xl p-12 shadow-xl border border-[#F5E6D3]">
                    <div className="text-6xl mb-6">{'\uD83D\uDD12'}</div>
                    <h2 className="text-2xl font-display font-bold text-gray-900 mb-3">Please login to view your wishlist</h2>
                    <p className="text-gray-500 mb-8">You need to be logged in to access your wishlist.</p>
                    <Link
                        to="/login"
                        state={{ from: '/wishlist' }}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#9B59B6] to-[#E74C8B] text-white rounded-full font-bold text-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                    >
                        Login
                    </Link>
                </div>
            </div>
        );
    }

    if (!wishlist.products || wishlist.products.length === 0) {
        return (
            <div className="min-h-screen bg-[#FFF8F0] py-16 px-4">
                <div className="max-w-2xl mx-auto text-center bg-white rounded-3xl p-12 shadow-xl border border-[#F5E6D3]">
                    <div className="text-6xl mb-6">{'\u2661'}</div>
                    <h2 className="text-2xl font-display font-bold text-gray-900 mb-3">Your Wishlist is empty</h2>
                    <p className="text-gray-500 mb-8">Save your favorite ice creams to come back to them later.</p>
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#9B59B6] to-[#E74C8B] text-white rounded-full font-bold text-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                    >
                        <Package size={20} />
                        Explore Ice Creams
                    </Link>
                </div>
            </div>
        );
    }

    const handleAddToCart = async (product) => {
        if (!user) {
            navigate('/login', { state: { from: '/wishlist' } });
            return;
        }
        if (product.stock <= 0) return;
        await addToCart(product._id, 1);
    };

    return (
        <div className="min-h-screen bg-[#FFF8F0] py-12 px-4">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-8">
                    My <span className="text-gradient">Wishlist</span>
                    <span className="ml-3 text-lg font-normal text-gray-500">({wishlist.products.length} items)</span>
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.products.map((product) => {
                        if (!product) return null;
                        const inStock = product.stock > 0;
                        return (
                            <div key={product._id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#F5E6D3] hover:shadow-md transition-shadow">
                                <div className="relative h-52 bg-[#FFF8F0] overflow-hidden">
                                    <img
                                        src={product.image || FALLBACK_IMAGE}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-3 left-3 bg-[#F5C6D0]/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#9B59B6] uppercase tracking-wider">
                                        {product.category}
                                    </div>
                                    {!inStock && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <span className="bg-white text-gray-800 font-bold px-4 py-2 rounded-full text-sm">Out of Stock</span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-5">
                                    <h3 className="font-display font-bold text-lg text-gray-800 mb-1 truncate">{product.name}</h3>
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="font-display font-bold text-xl text-[#9B59B6]">{'\u20B9'}{product.price}</span>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${inStock ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'}`}>
                                            {inStock ? `${product.stock} in stock` : 'Out of stock'}
                                        </span>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            disabled={!inStock}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all ${
                                                inStock
                                                    ? 'bg-gradient-to-r from-[#9B59B6] to-[#E74C8B] text-white hover:shadow-lg hover:shadow-purple-500/20'
                                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            }`}
                                        >
                                            <ShoppingCart size={16} />
                                            {inStock ? 'Add to Cart' : 'Out of Stock'}
                                        </button>
                                        <button
                                            onClick={() => removeFromWishlist(product._id)}
                                            className="px-3 py-2.5 rounded-xl border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-8 text-center">
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#9B59B6] font-bold rounded-full border border-[#F5C6D0] hover:bg-[#FFF8F0] transition-colors"
                    >
                        Continue Exploring
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Wishlist;
