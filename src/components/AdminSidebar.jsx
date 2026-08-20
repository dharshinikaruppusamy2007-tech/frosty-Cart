import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminSidebar = ({ isOpen, onClose }) => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const links = [
        { to: '/admin/dashboard', icon: '&#9632;', label: 'Dashboard' },
        { to: '/admin/products', icon: '&#128230;', label: 'Products' },
        { to: '/admin/categories', icon: '&#128193;', label: 'Categories' },
        { to: '/admin/customers', icon: '&#128101;', label: 'Customers' },
        { to: '/admin/orders', icon: '&#128179;', label: 'Orders' },
        { to: '/admin/stock', icon: '&#128200;', label: 'Stock' },
    ];

    const linkClass = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
            isActive
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
        }`;

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold text-purple-700">FrostyCart</h1>
                            <p className="text-xs text-gray-500 mt-1">Admin Panel</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="lg:hidden text-gray-500 hover:text-gray-700 text-xl"
                        >
                            &#10005;
                        </button>
                    </div>
                </div>

                <nav className="p-4 space-y-1">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={linkClass}
                            onClick={onClose}
                        >
                            <span dangerouslySetInnerHTML={{ __html: link.icon }} />
                            <span>{link.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
                    >
                        <span>&#10148;</span>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;
