import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
    return (
        <div className="min-h-screen bg-[#FFF8F0] py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">Get in <span className="text-gradient">Touch</span></h1>
                    <p className="text-lg text-gray-600 font-body">Have a question about our flavors, bulk orders, or anything else? We'd love to hear from you!</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">

                    {/* Contact Info */}
                    <div className="lg:w-1/3">
                        <div className="bg-gradient-to-br from-[#9B59B6] to-[#E74C8B] rounded-3xl p-8 text-white shadow-xl h-full flex flex-col pt-12 pb-12">
                            <h3 className="text-2xl font-display font-bold mb-8">Contact Information</h3>

                            <div className="space-y-8 flex-grow">
                                <div className="flex items-start gap-4">
                                    <div className="mt-1">
                                        <MapPin size={24} className="text-white/80" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">Our Location</h4>
                                        <p className="text-white/80 leading-relaxed">123 Sweet Tooth Lane,<br />Dessert City, DC 90210</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="mt-1">
                                        <Phone size={24} className="text-white/80" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">Call Us</h4>
                                        <p className="text-white/80">+1 (555) 123-4567<br />Mon-Fri: 9AM - 8PM</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="mt-1">
                                        <Mail size={24} className="text-white/80" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">Email Us</h4>
                                        <p className="text-white/80">hello@frostycart.com<br />support@frostycart.com</p>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative graphic */}
                            <div className="mt-auto pt-8">
                                <div className="text-7xl opacity-20 transform rotate-12 float-right -mb-4 -mr-4">🍦</div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:w-2/3 bg-white rounded-3xl shadow-lg p-8 md:p-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#F5C6D0] rounded-bl-[100px] opacity-30"></div>

                        <h3 className="text-3xl font-display font-bold text-gray-800 mb-8">Send us a Message</h3>

                        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent transition-all outline-none"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent transition-all outline-none"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number (Optional)</label>
                                <input
                                    type="tel"
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent transition-all outline-none"
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
                                <textarea
                                    rows={5}
                                    className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent transition-all outline-none resize-none"
                                    placeholder="How can we help you today?"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-[#9B59B6] text-white rounded-xl font-bold text-lg hover:bg-[#7D3C98] hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 w-full sm:w-auto"
                            >
                                Send Message
                                <Send size={20} />
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Contact;
