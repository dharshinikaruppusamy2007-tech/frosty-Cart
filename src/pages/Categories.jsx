import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import categoryCones from '../assets/category_cones.png';
import categorySundaes from '../assets/category_sundaes.png';
import categoryCakes from '../assets/category_cakes.png';
import categoryFamilyPacks from '../assets/category_family_packs.png';
import categoryMilkshakes from '../assets/category_milkshakes.png';

const Categories = () => {

    const categoryDetails = [
        { name: "Cones", icon: "🍦", desc: "Classic crunchy waffle cones paired with your favorite scoops.", image: categoryCones },
        { name: "Cups", icon: "🍨", desc: "The perfect no-mess way to enjoy our artisanal ice creams.", image: "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?auto=format&fit=crop&q=80&w=600" },
        { name: "Sundaes", icon: "🍧", desc: "Loaded with toppings, syrups, and lots of love.", image: categorySundaes },
        { name: "Ice Cream Cakes", icon: "🎂", desc: "Celebrate special moments with our frosted delights.", image: categoryCakes },
        { name: "Family Packs", icon: "📦", desc: "Bring the joy home with our large tubs for everyone.", image: categoryFamilyPacks },
        { name: "Milkshakes", icon: "🥤", desc: "Thick, creamy, and blended to absolute perfection.", image: categoryMilkshakes }
    ];

    return (
        <div className="min-h-screen bg-[#FFF8F0] pt-12 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">Explore Our <span className="text-gradient">Categories</span></h1>
                    <p className="text-lg text-gray-600 font-body">From crispy waffle cones to decadent ice cream cakes, explore a world of frozen desserts crafted just for you.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categoryDetails.map((cat, index) => (
                        <Link
                            key={index}
                            to={`/products?type=${cat.name}`}
                            className="bg-white rounded-[2rem] overflow-hidden group hover:-translate-y-2 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 border border-gray-100"
                        >
                            <div className="h-48 relative overflow-hidden">
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10"></div>
                                <img
                                    src={cat.image}
                                    alt={cat.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>

                            <div className="p-8">
                                <div className="flex justify-between items-center mb-3">
                                    <h3 className="text-2xl font-display font-bold text-gray-800">{cat.name}</h3>
                                    <div className="w-10 h-10 rounded-full bg-[#FFF8F0] flex items-center justify-center text-[#9B59B6] group-hover:bg-[#9B59B6] group-hover:text-white transition-colors">
                                        <ChevronRight size={20} />
                                    </div>
                                </div>
                                <p className="text-gray-500 font-body line-clamp-2">{cat.desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default Categories;
