import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-4xl animate-spin">&#10052;</div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
    }

    if (user.role !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
                    <div className="text-6xl mb-4">&#128683;</div>
                    <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
                    <p className="text-gray-600 mb-4">You do not have admin privileges.</p>
                    <a href="/" className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition">
                        Go to Home
                    </a>
                </div>
            </div>
        );
    }

    return children;
};

export default AdminProtectedRoute;
