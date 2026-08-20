import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&q=80&w=600';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();
    const { user } = useAuth();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const navigate = useNavigate();
    const [imgSrc, setImgSrc] = useState(product.image || FALLBACK_IMAGE);
    const wishlisted = isInWishlist(product._id);

    const handleAddToCart = async (e) => {
        e.preventDefault();
        if (!user) {
            navigate('/login', { state: { from: '/products' } });
            return;
        }
        await addToCart(product._id, 1);
    };

    const handleWishlistToggle = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
            navigate('/login', { state: { from: '/products' } });
            return;
        }
        if (wishlisted) {
            await removeFromWishlist(product._id);
        } else {
            await addToWishlist(product._id);
        }
    };

    return (
        <div className="bg-white rounded-3xl overflow-hidden card-shadow group transition-all duration-300 hover:-translate-y-2 hover:card-shadow-hover">
            <div className="relative h-64 overflow-hidden bg-[#FFF8F0]">
                <img
                    src={imgSrc}
                    alt={product.name}
                    onError={() => setImgSrc(FALLBACK_IMAGE)}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm text-sm font-bold text-gray-700">
                    <Star className="text-yellow-400 fill-yellow-400" size={14} />
                    {product.rating}
                </div>
                <div className="absolute top-4 left-4 bg-[#F5C6D0]/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#9B59B6] uppercase tracking-wider">
                    {product.category}
                </div>
                <button
                    onClick={handleWishlistToggle}
                    className="absolute bottom-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm transition-all hover:scale-110"
                >
                    <Heart
                        size={18}
                        className={wishlisted ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-400'}
                    />
                </button>
                {product.stock <= 0 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="bg-white text-gray-800 font-bold px-4 py-2 rounded-full text-sm">Out of Stock</span>
                    </div>
                )}
                {product.stock > 0 && product.stock <= 10 && (
                    <div className="absolute bottom-4 left-4 bg-orange-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white">
                        Only {product.stock} left!
                    </div>
                )}
            </div>

            <div className="p-6">
                <h3 className="font-display font-bold text-xl text-gray-800 mb-1 truncate">{product.name}</h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-4 h-10">{product.description}</p>

                <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Price</span>
                        <span className="font-display font-bold text-2xl text-[#9B59B6]">{'\u20B9'}{product.price}</span>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock <= 0}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
                            product.stock <= 0
                                ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                                : 'bg-[#FFF8F0] text-[#9B59B6] hover:bg-gradient-to-r hover:from-[#9B59B6] hover:to-[#E74C8B] hover:text-white'
                        }`}
                    >
                        <ShoppingCart size={20} className="ml-[-2px]" />
                    </button>
                </div>

                <Link
                    to={`/products/${product._id}`}
                    className="block w-full text-center mt-4 py-3 rounded-2xl bg-gray-50 text-gray-600 font-medium hover:bg-[#F5E6D3] hover:text-[#9B59B6] transition-colors duration-300 border border-transparent hover:border-[#F5C6D0]"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default ProductCard;
