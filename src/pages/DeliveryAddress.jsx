import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DeliveryAddress = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '', phone: '', address: '', city: '', state: '', pincode: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (!formData.fullName || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.pincode) {
            return setError('Please fill all required fields');
        }
        localStorage.setItem('deliveryAddress', JSON.stringify(formData));
        navigate('/payment');
    };

    return (
        <div className="min-h-screen bg-[#FFF8F0] py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-8">Delivery <span className="text-gradient">Address</span></h1>

                <div className="bg-white rounded-3xl p-8 shadow-xl border border-[#F5E6D3]">
                    {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-6 text-sm font-medium border border-red-100">{error}</div>}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input name="fullName" type="text" required value={formData.fullName} onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent outline-none transition-all"
                                placeholder="John Doe" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input name="phone" type="tel" required value={formData.phone} onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent outline-none transition-all"
                                placeholder="+1 (555) 000-0000" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <textarea name="address" required value={formData.address} onChange={handleChange} rows={3}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent outline-none transition-all resize-none"
                                placeholder="123 Main Street, Apt 4B" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                <input name="city" type="text" required value={formData.city} onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent outline-none transition-all"
                                    placeholder="New York" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                <input name="state" type="text" required value={formData.state} onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent outline-none transition-all"
                                    placeholder="NY" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                                <input name="pincode" type="text" required value={formData.pincode} onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent outline-none transition-all"
                                    placeholder="10001" />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button type="button" onClick={() => navigate('/cart')}
                                className="flex-1 py-4 border-2 border-gray-200 text-gray-600 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors">
                                Back to Cart
                            </button>
                            <button type="submit"
                                className="flex-1 py-4 bg-gradient-to-r from-[#9B59B6] to-[#E74C8B] text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all">
                                Continue to Payment
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DeliveryAddress;
