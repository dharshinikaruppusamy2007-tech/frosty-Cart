import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="bg-white pt-16 pb-8 border-t border-[#F5E6D3] mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

                    {/* Brand Info */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-2">
                            <span className="text-3xl">🍦</span>
                            <span className="font-display font-bold text-2xl text-gradient">FrostyCart</span>
                        </Link>
                        <p className="text-gray-500 mt-4 leading-relaxed font-body">
                            Delivering moments of joy in every scoop. Made with premium ingredients and a whole lot of love.
                        </p>
                        <div className="flex space-x-4 pt-2">
                            <a href="#" className="w-10 h-10 rounded-full bg-[#FFF8F0] flex items-center justify-center text-[#9B59B6] hover:bg-[#9B59B6] hover:text-white transition-all duration-300">
                                <FaFacebookF size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-[#FFF8F0] flex items-center justify-center text-[#9B59B6] hover:bg-[#9B59B6] hover:text-white transition-all duration-300">
                                <FaTwitter size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-[#FFF8F0] flex items-center justify-center text-[#9B59B6] hover:bg-[#9B59B6] hover:text-white transition-all duration-300">
                                <FaInstagram size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-display font-bold text-lg text-gray-800 mb-5 relative pb-2 inline-block">
                            Quick Links
                            <span className="absolute bottom-0 left-0 w-1/2 h-1 gradient-purple rounded-full"></span>
                        </h3>
                        <ul className="space-y-3 font-body text-gray-500">
                            <li><Link to="/products" className="hover:text-[#9B59B6] transition-colors">Shop Ice Creams</Link></li>
                            <li><Link to="/categories" className="hover:text-[#9B59B6] transition-colors">Our Categories</Link></li>
                            <li><Link to="/about" className="hover:text-[#9B59B6] transition-colors">About FrostyCart</Link></li>
                            <li><Link to="/contact" className="hover:text-[#9B59B6] transition-colors">Contact Us</Link></li>
                            <li><a href="#" className="hover:text-[#9B59B6] transition-colors">FAQs</a></li>
                        </ul>
                    </div>

                    {/* Customer Support */}
                    <div>
                        <h3 className="font-display font-bold text-lg text-gray-800 mb-5 relative pb-2 inline-block">
                            Customer Support
                            <span className="absolute bottom-0 left-0 w-1/2 h-1 gradient-purple rounded-full"></span>
                        </h3>
                        <ul className="space-y-3 font-body text-gray-500">
                            <li><a href="#" className="hover:text-[#9B59B6] transition-colors">Track Order</a></li>
                            <li><a href="#" className="hover:text-[#9B59B6] transition-colors">Returns & Refunds</a></li>
                            <li><a href="#" className="hover:text-[#9B59B6] transition-colors">Shipping Info</a></li>
                            <li><a href="#" className="hover:text-[#9B59B6] transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-[#9B59B6] transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-display font-bold text-lg text-gray-800 mb-5 relative pb-2 inline-block">
                            Contact Info
                            <span className="absolute bottom-0 left-0 w-1/2 h-1 gradient-purple rounded-full"></span>
                        </h3>
                        <ul className="space-y-4 font-body text-gray-500">
                            <li className="flex items-start gap-3">
                                <MapPin className="text-[#9B59B6] mt-1 shrink-0" size={18} />
                                <span>123 Sweet Tooth Lane, Dessert City, DC 90210</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="text-[#9B59B6] shrink-0" size={18} />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="text-[#9B59B6] shrink-0" size={18} />
                                <span>hello@frostycart.com</span>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="border-t border-[#F5E6D3] mt-12 pt-8 text-center text-gray-400 text-sm font-body">
                    <p>&copy; {new Date().getFullYear()} FrostyCart. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
