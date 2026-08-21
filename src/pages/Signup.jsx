import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', password: '', confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/login';

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password
                })
            });

            const data = await res.json().catch(() => ({}));
            if (res.ok) {
                setSuccess('Registration successful! Redirecting...');
                setTimeout(() => navigate('/login', { state: { from: from === '/login' ? '/' : from } }), 2000);
            } else {
                setError(data.message || `Registration failed (${res.status})`);
            }
        } catch (err) {
            setError('Server error. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-[#F5E6D3]">
                <h2 className="text-3xl font-display font-bold text-center text-gray-900 mb-8">
                    Join <span className="text-gradient">FrostyCart</span>
                </h2>

                {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4 text-sm font-medium border border-red-100">{error}</div>}
                {success && <div className="bg-green-50 text-green-500 p-3 rounded-lg mb-4 text-sm font-medium border border-green-100">{success}</div>}

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input name="name" type="text" required onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent outline-none transition-all" placeholder="John Doe" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input name="email" type="email" required onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent outline-none transition-all" placeholder="john@example.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input name="phone" type="tel" required onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent outline-none transition-all" placeholder="+1 (555) 000-0000" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input name="password" type="password" required minLength="6" onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent outline-none transition-all" placeholder="••••••••" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                        <input name="confirmPassword" type="password" required minLength="6" onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent outline-none transition-all" placeholder="••••••••" />
                    </div>

                    <button type="submit" className="w-full py-4 bg-gradient-to-r from-[#9B59B6] to-[#E74C8B] text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300">
                        Sign Up
                    </button>
                </form>

                <p className="mt-8 text-center text-gray-500">
                    Already have an account? <Link to="/login" className="text-[#9B59B6] font-bold hover:underline">Log In</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
