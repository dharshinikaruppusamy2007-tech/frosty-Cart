import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { token } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/admin/dashboard', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (err) {
                console.error('Failed to fetch dashboard stats');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [token]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-4xl animate-spin text-purple-600">&#10052;</div>
            </div>
        );
    }

    if (!stats) {
        return <div className="text-center py-20 text-gray-500">Failed to load dashboard data</div>;
    }

    const cards = [
        { label: 'Total Products', value: stats.totalProducts, icon: '&#128230;', color: 'bg-blue-500' },
        { label: 'Total Customers', value: stats.totalCustomers, icon: '&#128101;', color: 'bg-green-500' },
        { label: 'Total Orders', value: stats.totalOrders, icon: '&#128179;', color: 'bg-orange-500' },
        { label: 'Total Revenue', value: `Rs.${stats.totalRevenue.toLocaleString()}`, icon: '&#128176;', color: 'bg-purple-500' },
        { label: 'Pending Orders', value: stats.pendingOrders, icon: '&#9203;', color: 'bg-yellow-500' },
        { label: 'Low Stock Products', value: stats.lowStockProducts.length, icon: '&#9888;', color: 'bg-red-500' },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {cards.map((card, idx) => (
                    <div key={idx} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl`}
                                dangerouslySetInnerHTML={{ __html: card.icon }}
                            />
                            <div>
                                <p className="text-sm text-gray-500">{card.label}</p>
                                <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {stats.lowStockProducts.length > 0 && (
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Low Stock Products</h3>
                        <div className="space-y-3">
                            {stats.lowStockProducts.map((p) => (
                                <div key={p._id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                    <span className="text-sm text-gray-700">{p.name}</span>
                                    <span className="text-sm font-medium text-red-600">{p.stock} left</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h3>
                    <div className="space-y-3">
                        {stats.recentOrders.map((order) => (
                            <div key={order._id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">{order.orderId}</p>
                                    <p className="text-xs text-gray-500">{order.user?.name || 'N/A'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-gray-800">Rs.{order.totalAmount}</p>
                                    <p className={`text-xs font-medium ${
                                        order.orderStatus === 'Delivered' ? 'text-green-600' :
                                        order.orderStatus === 'Cancelled' ? 'text-red-600' :
                                        'text-yellow-600'
                                    }`}>{order.orderStatus}</p>
                                </div>
                            </div>
                        ))}
                        {stats.recentOrders.length === 0 && (
                            <p className="text-sm text-gray-500">No orders yet</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
