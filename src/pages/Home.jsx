import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { ArrowRight, CheckCircle2, ChevronRight, Truck, ShieldCheck, Leaf } from 'lucide-react';
import heroImg from '../assets/hero_ice_cream.png';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
                if (res.ok) {
                    const data = await res.json();
                    setFeaturedProducts(data.slice(0, 4));
                }
            } catch (err) {
                console.error('Failed to fetch products', err);
            }
        };
        fetchProducts();
    }, []);

    const categories = [
        { name: "Cones", icon: "🍦", bg: "bg-[#FFF9E3]", color: "text-yellow-600" },
        { name: "Cups", icon: "🍨", bg: "bg-[#E8D5F5]", color: "text-purple-600" },
        { name: "Sundaes", icon: "🍧", bg: "bg-[#F5C6D0]", color: "text-pink-600" },
        { name: "Cakes", icon: "🎂", bg: "bg-[#FFDAB9]", color: "text-orange-600" },
        { name: "Packs", icon: "📦", bg: "bg-[#A8E6CF]", color: "text-green-600" },
        { name: "Shakes", icon: "🥤", bg: "bg-[#F5E6D3]", color: "text-amber-700" }
    ];

    return (
        <div className="flex flex-col min-h-screen">

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-[#FFF8F0] pt-10 pb-16 lg:pt-16 lg:pb-24">
                <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[#F5C6D0] rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-[#E8D5F5] rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-8">
                        <div className="w-full lg:w-1/2 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-sm border border-[#F5C6D0] text-[#9B59B6] font-medium text-sm mb-4 shadow-sm">
                                <span className="animate-pulse">✨</span> Premium Handcrafted Ice Cream
                            </div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-gray-900 leading-tight mb-4">
                                Delicious <span className="text-gradient">Ice Cream</span>,<br /> Delivered to Your Door
                            </h1>
                            <p className="text-base sm:text-lg text-gray-600 mb-6 max-w-xl mx-auto lg:mx-0 font-body leading-relaxed">
                                Discover creamy, delicious flavors made to brighten every moment. Treat yourself to our carefully crafted artisanal scoops today.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                                <Link to="/products" className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-[#9B59B6] to-[#E74C8B] text-white rounded-full font-bold text-base hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 flex items-center justify-center gap-2 group">
                                    Shop Now
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                                </Link>
                                <Link to="/categories" className="w-full sm:w-auto px-7 py-3.5 bg-white text-[#9B59B6] border-2 border-[#E8D5F5] rounded-full font-bold text-base hover:bg-[#F5E6D3] hover:border-[#F5E6D3] transition-all duration-300 flex items-center justify-center">
                                    Explore Flavors
                                </Link>
                            </div>
                        </div>

                        <div className="w-full lg:w-1/2 relative mt-8 lg:mt-0 flex justify-center">
                            {/* outer wrapper with overflow-visible so badges don't clip */}
                            <div className="relative w-[340px] h-[340px] sm:w-[390px] sm:h-[390px] lg:w-[420px] lg:h-[420px]">
                                {/* rotated lavender ring behind */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#E8D5F5] to-[#F5C6D0] rounded-full transform -rotate-6 scale-105 shadow-2xl"></div>
                                {/* main white circle */}
                                <div className="relative z-10 w-full h-full bg-white rounded-full shadow-xl border-[6px] border-white flex items-center justify-center overflow-hidden">
                                    <img
                                        src={heroImg}
                                        alt="Premium Ice Cream"
                                        className="w-full h-full object-cover transform scale-110"
                                    />
                                </div>

                                {/* badge top-left */}
                                <div className="absolute top-6 -left-2 bg-white p-2.5 rounded-2xl shadow-xl flex items-center gap-2 z-20 animate-bounce" style={{ animationDuration: '3s' }}>
                                    <div className="bg-green-100 p-1.5 rounded-full text-green-500"><Leaf size={16} /></div>
                                    <div className="flex flex-col text-xs">
                                        <span className="font-bold text-gray-800">100% Natural</span>
                                        <span className="text-gray-500 text-[10px]">Ingredients</span>
                                    </div>
                                </div>

                                {/* badge bottom-right */}
                                <div className="absolute bottom-14 -right-2 bg-white p-2.5 rounded-2xl shadow-xl flex items-center gap-2 z-20 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                                    <div className="bg-yellow-100 p-1.5 rounded-full text-yellow-500 text-sm">⭐</div>
                                    <div className="flex flex-col text-xs">
                                        <span className="font-bold text-gray-800">4.9 Rating</span>
                                        <span className="text-gray-500 text-[10px]">Happy Customers</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Popular Categories */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">Popular Categories</h2>
                            <p className="text-gray-500 font-body max-w-2xl">Browse through our wide selection of treats, from classic cones to decadent family packs.</p>
                        </div>
                        <Link to="/categories" className="hidden md:flex items-center text-[#9B59B6] font-medium hover:text-[#7D3C98] group">
                            View All <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {categories.map((cat, index) => (
                            <Link key={index} to={`/categories?type=${cat.name}`} className="flex flex-col items-center justify-center p-6 rounded-3xl border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300 group bg-gray-50 hover:bg-white cursor-pointer">
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4 group-hover:scale-110 transition-transform ${cat.bg}`}>
                                    {cat.icon}
                                </div>
                                <h3 className="font-display font-bold text-gray-800 text-lg group-hover:text-[#9B59B6] transition-colors">{cat.name}</h3>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-8 text-center md:hidden">
                        <Link to="/categories" className="inline-flex items-center text-[#9B59B6] font-medium hover:text-[#7D3C98] group">
                            View All Categories <ChevronRight className="group-hover:translate-x-1 transition-transform" size={20} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Featured Ice Creams */}
            <section className="py-20 bg-[#fbf5ef]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-[#9B59B6] font-bold tracking-wider uppercase text-sm mb-2 block">Our Best Sellers</span>
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 mb-4">Featured Flavors</h2>
                        <p className="text-gray-500 font-body max-w-2xl mx-auto text-lg">Hand-picked selections that our customers keep coming back for. Which one will be your new favorite?</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredProducts.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <Link to="/products" className="inline-flex px-8 py-4 bg-white text-gray-800 border border-gray-200 rounded-full font-bold text-lg hover:bg-[#FFF8F0] hover:border-[#F5C6D0] hover:text-[#9B59B6] transition-all duration-300 items-center justify-center shadow-sm hover:shadow-md">
                            View All Ice Creams
                        </Link>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-24 bg-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-pink-50 rounded-bl-[100px] -z-10"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-50 rounded-tr-[100px] -z-10"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2 relative">
                            <div className="relative">
                                <img
                                    src="https://images.unsplash.com/photo-1516559828984-fb3b99548b21?auto=format&fit=crop&q=80&w=800"
                                    alt="Delicious ice cream cones"
                                    className="rounded-3xl shadow-2xl"
                                />
                                <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-[#FFF8F0] rounded-full -z-10"></div>
                                <div className="absolute -top-8 -left-8 w-32 h-32 bg-[#E8D5F5] rounded-full -z-10"></div>
                            </div>
                        </div>

                        <div className="lg:w-1/2">
                            <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 mb-6 leading-tight">
                                Why Choose <br /><span className="text-gradient">FrostyCart?</span>
                            </h2>
                            <p className="text-lg text-gray-600 mb-10 font-body">
                                We believe that every scoop should be a moment of pure joy. That's why we're committed to delivering only the best to your doorstep.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-500 flex items-center justify-center shrink-0">
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-display font-bold text-xl text-gray-800 mb-2">Fresh & Delicious</h4>
                                        <p className="text-gray-500 text-sm">Made fresh daily in small batches for maximum flavor.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-500 flex items-center justify-center shrink-0">
                                        <Truck size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-display font-bold text-xl text-gray-800 mb-2">Fast Delivery</h4>
                                        <p className="text-gray-500 text-sm">Delivered frozen solid in our custom insulated packaging.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-green-100 text-green-500 flex items-center justify-center shrink-0">
                                        <Leaf size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-display font-bold text-xl text-gray-800 mb-2">Quality Ingredients</h4>
                                        <p className="text-gray-500 text-sm">Sourced globally, prioritizing real dairies and natural fruits.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-500 flex items-center justify-center shrink-0">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-display font-bold text-xl text-gray-800 mb-2">Secure Shopping</h4>
                                        <p className="text-gray-500 text-sm">Safe, secure checkout and satisfaction guaranteed.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#9B59B6] via-[#E74C8B] to-[#F5C6D0]"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight">
                        Your Perfect Scoop is Just a Click Away!
                    </h2>
                    <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto font-body">
                        Join thousands of happy customers who satisfy their sweet cravings with FrostyCart.
                    </p>
                    <Link to="/products" className="inline-block px-10 py-5 bg-white text-[#9B59B6] rounded-full font-bold text-xl hover:bg-[#FFF8F0] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 shadow-xl">
                        Shop Ice Creams Now
                    </Link>
                </div>
            </section>

        </div>
    );
};

export default Home;
