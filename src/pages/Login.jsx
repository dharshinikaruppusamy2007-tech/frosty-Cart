import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/';

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (res.ok) {
                login(data, data.token);
                navigate(from);
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Server error. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-[#F5E6D3]">
                <div className="text-center mb-8">
                    <span className="text-5xl mb-4 block">🍦</span>
                    <h2 className="text-3xl font-display font-bold text-gray-900">
                        Welcome Back
                    </h2>
                    <p className="text-gray-500 mt-2">Log in to your FrostyCart account</p>
                </div>

                {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-6 text-sm font-medium border border-red-100">{error}</div>}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input name="email" type="email" required onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent outline-none transition-all" placeholder="john@example.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input name="password" type="password" required onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#9B59B6] focus:border-transparent outline-none transition-all" placeholder="••••••••" />
                    </div>

                    <button type="submit" className="w-full py-4 bg-gradient-to-r from-[#9B59B6] to-[#E74C8B] text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300">
                        Log In
                    </button>
                </form>

                <p className="mt-8 text-center text-gray-500">
                    Don't have an account? <Link to="/signup" className="text-[#9B59B6] font-bold hover:underline">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
