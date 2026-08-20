import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, ShoppingCart, User, LogOut, Package, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const { wishlistCount } = useWishlist();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsOpen(false);
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Ice Creams', path: '/products' },
        { name: 'Categories', path: '/categories' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-[#F5E6D3]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">

                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <span className="text-3xl">🍦</span>
                            <span className="font-display font-bold text-2xl text-gradient">FrostyCart</span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <div className="flex space-x-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="font-medium text-gray-600 hover:text-[#9B59B6] transition-colors duration-300"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        {/* Icons */}
                        <div className="flex items-center space-x-4 border-l border-gray-200 pl-6">
                            <button className="text-gray-600 hover:text-[#9B59B6] transition-colors">
                                <Search size={20} />
                            </button>
                            <Link to="/wishlist" className="text-gray-600 hover:text-[#9B59B6] transition-colors relative">
                                <Heart size={20} />
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-[#F5C6D0] text-[#9B59B6] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                        {wishlistCount}
                                    </span>
                                )}
                            </Link>
                            <Link to="/cart" className="text-gray-600 hover:text-[#9B59B6] transition-colors relative">
                                <ShoppingCart size={20} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-[#F5C6D0] text-[#9B59B6] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                            {user ? (
                                <>
                                    <Link to="/orders" className="flex items-center gap-2 text-gray-600 hover:text-[#9B59B6] transition-colors font-medium text-sm">
                                        <Package size={18} />
                                        <span>Orders</span>
                                    </Link>
                                    <Link to="/profile" className="flex items-center gap-2 bg-[#FFF8F0] hover:bg-[#F5E6D3] text-[#9B59B6] px-4 py-2 rounded-full font-medium transition-colors border border-[#F5E6D3]">
                                        <User size={18} />
                                        <span>Profile</span>
                                    </Link>
                                    <button onClick={handleLogout} className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-600 px-4 py-2 rounded-full font-medium transition-colors border border-gray-200">
                                        <LogOut size={18} />
                                        <span>Logout</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="flex items-center gap-2 bg-[#FFF8F0] hover:bg-[#F5E6D3] text-[#9B59B6] px-4 py-2 rounded-full font-medium transition-colors border border-[#F5E6D3]">
                                        <User size={18} />
                                        <span>Login</span>
                                    </Link>
                                    <Link to="/signup" className="flex items-center gap-2 bg-[#9B59B6] hover:bg-[#7D3C98] text-white px-4 py-2 rounded-full font-medium transition-colors border border-transparent shadow-sm">
                                        <span>Sign Up</span>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center gap-4">
                        <Link to="/wishlist" className="text-gray-600 relative">
                            <Heart size={24} />
                            {wishlistCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[#F5C6D0] text-[#9B59B6] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>
                        <Link to="/cart" className="text-gray-600 relative">
                            <ShoppingCart size={24} />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[#F5C6D0] text-[#9B59B6] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <button
                            onClick={toggleMenu}
                            className="text-gray-600 hover:text-[#9B59B6] focus:outline-none"
                        >
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-b border-[#F5E6D3] absolute w-full shadow-lg">
                    <div className="px-4 pt-2 pb-6 space-y-1 sm:px-3 flex flex-col items-center">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className="block px-3 py-3 text-base font-medium text-gray-700 hover:text-[#9B59B6] hover:bg-[#FFF8F0] rounded-md w-full text-center transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="mt-4 pt-4 border-t border-gray-100 w-full flex flex-col gap-4 items-center">
                            <button className="flex items-center justify-center gap-2 w-full py-2 text-gray-600 hover:text-[#9B59B6]">
                                <Search size={20} />
                                <span>Search Flavors</span>
                            </button>
                            {user ? (
                                <>
                                    <Link to="/orders" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 w-full py-2 bg-[#FFF8F0] text-[#9B59B6] rounded-full font-medium border border-[#F5E6D3]">
                                        <Package size={18} />
                                        <span>Orders</span>
                                    </Link>
                                    <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 w-full py-2 bg-[#FFF8F0] text-[#9B59B6] rounded-full font-medium border border-[#F5E6D3]">
                                        <User size={18} />
                                        <span>Profile</span>
                                    </Link>
                                    <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full py-2 bg-gray-50 text-gray-600 rounded-full font-medium border border-gray-200 mt-2">
                                        <LogOut size={18} />
                                        <span>Logout</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 w-full py-2 bg-white text-[#9B59B6] border border-[#9B59B6] rounded-full font-medium">
                                        <User size={18} />
                                        <span>Login</span>
                                    </Link>
                                    <Link to="/signup" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 w-full py-2 bg-gradient-to-r from-[#9B59B6] to-[#E74C8B] text-white rounded-full font-medium mt-2">
                                        <span>Sign Up</span>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
