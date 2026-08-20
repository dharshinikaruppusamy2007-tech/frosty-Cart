import React from 'react';

const About = () => {
    return (
        <div className="bg-white min-h-screen pt-12 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                    <div className="w-full lg:w-1/2 relative">
                        <div className="absolute inset-0 bg-[#F5C6D0] rounded-[3rem] transform -rotate-3 scale-105 -z-10"></div>
                        <img
                            src="https://images.unsplash.com/photo-1568219158202-cd9bf213520a?auto=format&fit=crop&q=80&w=800"
                            alt="People enjoying ice cream"
                            className="rounded-[3rem] shadow-2xl object-cover w-full h-[500px] lg:h-[560px] transition-transform duration-500 hover:scale-[1.02]"
                        />
                    </div>

                    <div className="w-full lg:w-1/2">
                        <h4 className="text-[#9B59B6] font-bold tracking-wider uppercase text-sm mb-2">Our Story</h4>
                        <h1 className="text-3xl md:text-5xl font-display font-bold text-gray-900 mb-6 leading-tight">
                            Spreading Joy, <br /><span className="text-gradient">One Scoop at a Time.</span>
                        </h1>

                        <p className="text-lg text-gray-600 mb-6 font-body leading-relaxed">
                            FrostyCart started with a simple belief: ice cream isn't just a dessert, it's a vehicle for nostalgia, joy, and connection. What began as a small parlor in the neighborhood has now grown into a premium digital storefront delivering happiness straight to your door.
                        </p>

                        <p className="text-lg text-gray-600 mb-8 font-body leading-relaxed">
                            We source our ingredients responsibly, partnering with local dairies and global purveyors of authentic flavors. Every batch is churned with care to ensure the perfect, creamy texture you love.
                        </p>

                        <div className="grid grid-cols-2 gap-8 border-t border-gray-100 pt-8">
                            <div>
                                <h3 className="text-4xl font-display font-bold text-[#9B59B6] mb-2">50+</h3>
                                <p className="text-gray-500 font-medium">Unique Flavors</p>
                            </div>
                            <div>
                                <h3 className="text-4xl font-display font-bold text-[#E74C8B] mb-2">10k+</h3>
                                <p className="text-gray-500 font-medium">Happy Customers</p>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default About;
