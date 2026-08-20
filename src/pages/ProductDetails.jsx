import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ArrowLeft, Minus, Plus, ShoppingCart, Heart, ShieldCheck, Truck, Clock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&q=80&w=600';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { user } = useAuth();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [addedMsg, setAddedMsg] = useState(false);
    const [wishMsg, setWishMsg] = useState('');
    const [stockError, setStockError] = useState('');
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [imgSrc, setImgSrc] = useState('');

    const wishlisted = product ? isInWishlist(product._id) : false;

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setNotFound(false);
            try {
                const res = await fetch(`http://localhost:5000/api/products/${id}`);
                if (res.status === 404) {
                    setNotFound(true);
                    return;
                }
                if (!res.ok) throw new Error('Failed to fetch product');
                const data = await res.json();
                setProduct(data);
                setImgSrc(data.image || FALLBACK_IMAGE);
            } catch (err) {
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#FFF8F0]">
                <div className="text-6xl mb-4 animate-spin">{'\uD83C\uDF66'}</div>
                <h2 className="text-2xl font-display font-bold text-gray-800">Loading deliciousness...</h2>
            </div>
        );
    }

    if (notFound || !product) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#FFF8F0]">
                <div className="text-6xl mb-4">{'\uD83D\uDE22'}</div>
                <h2 className="text-3xl font-display font-bold text-gray-800 mb-2">Product not found</h2>
                <p className="text-gray-500 font-body mb-6">The product you're looking for doesn't exist or has been removed.</p>
                <button
                    onClick={() => navigate('/products')}
                    className="px-6 py-3 bg-[#9B59B6] text-white font-bold rounded-full hover:opacity-90 transition-opacity"
                >
                    Browse Ice Creams
                </button>
            </div>
        );
    }

    const handleQuantityChange = (type) => {
        setStockError('');
        if (type === 'decrease' && quantity > 1) {
            setQuantity(quantity - 1);
        } else if (type === 'increase') {
            if (quantity >= product.stock) {
                setStockError(`Only ${product.stock} items are available.`);
                return;
            }
            setQuantity(quantity + 1);
        }
    };

    const handleAddToCart = async () => {
        if (!user) {
            navigate('/login', { state: { from: `/products/${id}` } });
            return;
        }
        const success = await addToCart(product._id, quantity);
        if (success) {
            setAddedMsg(true);
            setTimeout(() => setAddedMsg(false), 2000);
        }
    };

    const handleBuyNow = async () => {
        if (!user) {
            navigate('/login', { state: { from: `/products/${id}` } });
            return;
        }
        const success = await addToCart(product._id, quantity);
        if (success) {
            navigate('/cart');
        }
    };

    const handleWishlistToggle = async () => {
        if (!user) {
            navigate('/login', { state: { from: `/products/${id}` } });
            return;
        }
        if (wishlisted) {
            await removeFromWishlist(product._id);
            setWishMsg('Removed from wishlist');
        } else {
            const result = await addToWishlist(product._id);
            if (result.success) {
                setWishMsg('Added to wishlist!');
            } else if (result.alreadyExists) {
                setWishMsg('Already in your wishlist');
            }
        }
        setTimeout(() => setWishMsg(''), 2000);
    };

    const outOfStock = product.stock <= 0;

    return (
        <div className="min-h-screen bg-[#FFF8F0] pt-8 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-[#9B59B6] transition-colors mb-8 group font-medium"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Back to browsing
                </button>

                {addedMsg && (
                    <div className="mb-6 bg-green-50 text-green-600 p-4 rounded-2xl font-medium border border-green-100 flex items-center gap-2">
                        <span className="text-xl">{'\u2713'}</span> Added to cart successfully!
                    </div>
                )}

                {wishMsg && (
                    <div className="mb-6 bg-purple-50 text-purple-600 p-4 rounded-2xl font-medium border border-purple-100 flex items-center gap-2">
                        <Heart size={18} className="fill-purple-500 text-purple-500" />
                        {wishMsg}
                    </div>
                )}

                <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden">
                    <div className="flex flex-col lg:flex-row">
                        <div className="lg:w-1/2 relative bg-[#F5E6D3]/30 p-8 lg:p-16 flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent"></div>
                            <div className="absolute top-8 left-8 flex flex-col gap-3 z-10">
                                <span className="bg-[#9B59B6] text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-md">Best Seller</span>
                                <span className="bg-white text-gray-800 border border-gray-200 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">{product.category}</span>
                            </div>
                            <button
                                onClick={handleWishlistToggle}
                                className={`absolute top-8 right-8 w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all z-10 ${
                                    wishlisted
                                        ? 'bg-red-50 text-red-500'
                                        : 'bg-white text-gray-400 hover:text-red-500 hover:bg-red-50'
                                }`}
                            >
                                <Heart size={24} className={wishlisted ? 'fill-red-500' : ''} />
                            </button>
                            <img
                                src={imgSrc}
                                alt={product.name}
                                onError={() => setImgSrc(FALLBACK_IMAGE)}
                                className="w-full max-w-md h-auto object-cover rounded-2xl shadow-2xl relative z-10 transform -rotate-2 hover:rotate-0 transition-transform duration-500"
                            />
                        </div>

                        <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={18} className={`${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                    ))}
                                </div>
                                <span className="text-gray-500 text-sm font-medium">({product.rating} / 5 Rating)</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">{product.name}</h1>

                            <div className="text-3xl font-display font-bold text-[#9B59B6] mb-6">
                                {'\u20B9'}{product.price}
                            </div>

                            <p className="text-gray-600 text-lg leading-relaxed mb-8 font-body">
                                {product.description}
                            </p>

                            <div className="mb-6 flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-500">Stock:</span>
                                {outOfStock ? (
                                    <span className="text-sm font-bold text-red-500 bg-red-50 px-3 py-1 rounded-full">Out of stock</span>
                                ) : product.stock <= 10 ? (
                                    <span className="text-sm font-bold text-orange-500 bg-orange-50 px-3 py-1 rounded-full">Only {product.stock} left!</span>
                                ) : (
                                    <span className="text-sm font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full">{product.stock} available</span>
                                )}
                            </div>

                            {stockError && (
                                <div className="mb-4 bg-orange-50 text-orange-600 px-4 py-2 rounded-xl text-sm font-medium border border-orange-100">
                                    {stockError}
                                </div>
                            )}

                            <hr className="border-gray-100 mb-8" />

                            <div className="flex flex-col sm:flex-row gap-4 mb-10">
                                <div className="flex items-center justify-between border-2 border-gray-200 bg-white rounded-2xl px-4 py-2 w-full sm:w-40 h-14">
                                    <button
                                        onClick={() => handleQuantityChange('decrease')}
                                        disabled={quantity <= 1}
                                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <span className="font-bold text-lg text-gray-800 w-8 text-center">{quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange('increase')}
                                        disabled={quantity >= product.stock}
                                        className="w-8 h-8 flex items-center justify-center text-[#9B59B6] hover:bg-[#FFF8F0] rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    disabled={outOfStock}
                                    className={`flex-1 border-2 rounded-2xl font-bold text-lg h-14 transition-colors flex items-center justify-center gap-2 ${
                                        outOfStock
                                            ? 'border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed'
                                            : 'border-[#9B59B6] text-[#9B59B6] bg-white hover:bg-[#FFF8F0]'
                                    }`}
                                >
                                    <ShoppingCart size={22} />
                                    {outOfStock ? 'Out of Stock' : 'Add to Cart'}
                                </button>

                                <button
                                    onClick={handleBuyNow}
                                    disabled={outOfStock}
                                    className={`flex-1 rounded-2xl font-bold text-lg h-14 transition-all flex items-center justify-center ${
                                        outOfStock
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-[#9B59B6] to-[#E74C8B] text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-pink-500/40'
                                    }`}
                                >
                                    Buy Now
                                </button>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                                <button
                                    onClick={handleWishlistToggle}
                                    className={`flex-1 rounded-2xl font-bold text-base h-12 transition-all flex items-center justify-center gap-2 border-2 ${
                                        wishlisted
                                            ? 'border-red-300 bg-red-50 text-red-500'
                                            : 'border-gray-200 bg-white text-gray-600 hover:border-pink-300 hover:text-pink-500 hover:bg-pink-50'
                                    }`}
                                >
                                    <Heart size={18} className={wishlisted ? 'fill-red-500' : ''} />
                                    {wishlisted ? 'Added to Wishlist' : 'Add to Wishlist'}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-4 rounded-2xl">
                                    <ShieldCheck className="text-green-500" size={24} />
                                    <span className="font-medium text-sm">Quality Guarantee</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-4 rounded-2xl">
                                    <Truck className="text-[#9B59B6]" size={24} />
                                    <span className="font-medium text-sm">Frost-Free Delivery</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-4 rounded-2xl sm:col-span-2">
                                    <Clock className="text-orange-400" size={24} />
                                    <span className="font-medium text-sm">Estimated Delivery: Within 45 minutes</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
