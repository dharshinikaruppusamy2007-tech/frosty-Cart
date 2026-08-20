import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Calendar, LogOut } from 'lucide-react';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!user) return null; // Fallback, ProtectedRoute handles this

    return (
        <div className="min-h-screen bg-[#FFF8F0] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-[#F5E6D3]">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#9B59B6] to-[#E74C8B] px-8 py-12 text-white text-center relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/40">
                            <User size={48} className="text-white" />
                        </div>
                        <h1 className="text-3xl font-display font-bold mb-1">{user.name}</h1>
                        <p className="opacity-90 capitalize font-medium px-3 py-1 bg-white/20 rounded-full inline-block text-sm">{user.role}</p>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        <h2 className="text-xl font-display font-bold text-gray-800 border-b border-gray-100 pb-4 mb-6">Account Details</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                                <div className="bg-[#FFF8F0] p-2 rounded-xl text-[#9B59B6]">
                                    <User size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Full Name</p>
                                    <p className="font-bold text-gray-800">{user.name}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                                <div className="bg-[#FFF8F0] p-2 rounded-xl text-[#9B59B6]">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Email Address</p>
                                    <p className="font-bold text-gray-800">{user.email}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                                <div className="bg-[#FFF8F0] p-2 rounded-xl text-[#9B59B6]">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Phone Number</p>
                                    <p className="font-bold text-gray-800">{user.phone}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl">
                                <div className="bg-[#FFF8F0] p-2 rounded-xl text-[#9B59B6]">
                                    <Calendar size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Member Since</p>
                                    <p className="font-bold text-gray-800">
                                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center border-t border-gray-100 pt-8">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-8 py-3 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl font-bold transition-colors"
                            >
                                <LogOut size={20} />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
