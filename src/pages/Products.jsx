import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const priceRanges = [
    { label: 'All Prices', min: '', max: '' },
    { label: 'Under ₹100', min: '', max: '100' },
    { label: '₹100 – ₹200', min: '100', max: '200' },
    { label: '₹200 – ₹300', min: '200', max: '300' },
    { label: 'Above ₹300', min: '300', max: '' }
];

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedPriceRange, setSelectedPriceRange] = useState(0);
    const [sortBy, setSortBy] = useState('popular');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError('');
            try {
                const params = new URLSearchParams();
                if (selectedCategory && selectedCategory !== 'All') params.append('category', selectedCategory);
                if (searchTerm) params.append('search', searchTerm);
                if (minPrice) params.append('minPrice', minPrice);
                if (maxPrice) params.append('maxPrice', maxPrice);

                const url = `http://localhost:5000/api/products${params.toString() ? '?' + params.toString() : ''}`;
                const res = await fetch(url);
                if (!res.ok) throw new Error('Failed to fetch products');
                const data = await res.json();
                setProducts(data);
            } catch (err) {
                setError('Unable to load products. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [selectedCategory, searchTerm, minPrice, maxPrice]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/products/categories');
                if (res.ok) {
                    const data = await res.json();
                    setCategories(data);
                }
            } catch (err) {
                // Silently fail — categories will remain empty
            }
        };
        fetchCategories();
    }, []);

    const handlePriceRange = (index) => {
        setSelectedPriceRange(index);
        setMinPrice(priceRanges[index].min);
        setMaxPrice(priceRanges[index].max);
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('All');
        setSelectedPriceRange(0);
        setMinPrice('');
        setMaxPrice('');
    };

    const sortedProducts = [...products].sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0;
    });

    const hasActiveFilters = searchTerm || selectedCategory !== 'All' || selectedPriceRange !== 0;

    return (
        <div className="min-h-screen bg-[#FFF8F0] pt-10 pb-20">
            <div className="bg-white border-b border-[#F5E6D3] pb-10 shadow-sm relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center md:text-left md:flex justify-between items-end mb-8 pt-8">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">Our <span className="text-gradient">Ice Creams</span></h1>
                            <p className="text-gray-500 font-body text-lg max-w-2xl">Discover our handcrafted flavors. Perfectly churned for your enjoyment.</p>
                        </div>
                        <div className="mt-6 md:mt-0 text-sm font-medium text-gray-500">
                            Showing <span className="text-[#9B59B6] font-bold">{sortedProducts.length}</span> products
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-4 items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <div className="relative w-full lg:w-1/3">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent transition-all outline-none text-gray-700"
                                placeholder="Search flavors..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
                            <button
                                onClick={() => setSelectedCategory('All')}
                                className={`flex-shrink-0 px-6 py-3 rounded-xl font-medium text-sm transition-all ${selectedCategory === 'All' ? 'bg-[#9B59B6] text-white shadow-md shadow-purple-500/20' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
                            >
                                All Flavors
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`flex-shrink-0 px-6 py-3 rounded-xl font-medium text-sm transition-all ${selectedCategory === cat ? 'bg-[#9B59B6] text-white shadow-md shadow-purple-500/20' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="w-full lg:w-auto ml-auto relative mt-2 lg:mt-0 flex items-center gap-2">
                            <SlidersHorizontal className="text-gray-400" size={20} />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="appearance-none block w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#9B59B6] font-medium text-sm cursor-pointer"
                            >
                                <option value="popular">Most Popular</option>
                                <option value="rating">Top Rated</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                        {priceRanges.map((range, index) => (
                            <button
                                key={range.label}
                                onClick={() => handlePriceRange(index)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedPriceRange === index ? 'bg-[#9B59B6] text-white shadow-md shadow-purple-500/20' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
                            >
                                {range.label}
                            </button>
                        ))}
                        {hasActiveFilters && (
                            <button
                                onClick={handleClearFilters}
                                className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium bg-red-50 text-red-500 hover:bg-red-100 transition-all ml-2"
                            >
                                <X size={14} />
                                Clear All Filters
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
                {loading ? (
                    <div className="text-center py-32">
                        <div className="text-6xl mb-4 animate-spin">🍦</div>
                        <p className="text-gray-500 font-body text-lg">Loading deliciousness...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-gray-300">
                        <div className="text-6xl mb-4">⚠️</div>
                        <h3 className="text-2xl font-display font-bold text-gray-800 mb-2">Something went wrong</h3>
                        <p className="text-gray-500 font-body">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-6 px-6 py-3 bg-[#FFF8F0] text-[#9B59B6] font-bold rounded-full hover:bg-[#F5E6D3] transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                ) : sortedProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {sortedProducts.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-gray-300">
                        <div className="text-6xl mb-4">🧊</div>
                        <h3 className="text-2xl font-display font-bold text-gray-800 mb-2">No products found</h3>
                        <p className="text-gray-500 font-body">Try adjusting your filters or search term.</p>
                        <button
                            onClick={handleClearFilters}
                            className="mt-6 px-6 py-3 bg-[#FFF8F0] text-[#9B59B6] font-bold rounded-full hover:bg-[#F5E6D3] transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Products;
