import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AdminStock = () => {
    const { token } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editId, setEditId] = useState(null);
    const [editStock, setEditStock] = useState('');
    const [updating, setUpdating] = useState(false);

    const fetchProducts = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/admin/stock', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) setProducts(await res.json());
        } catch (err) {
            console.error('Failed to fetch stock');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, [token]);

    const handleUpdateStock = async (productId) => {
        setUpdating(true);
        try {
            const res = await fetch(`http://localhost:5000/api/admin/stock/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ stock: Number(editStock) })
            });

            if (res.ok) {
                const updated = await res.json();
                setProducts(products.map(p => p._id === productId ? { ...p, stock: updated.stock } : p));
                setEditId(null);
            }
        } catch (err) {
            console.error('Failed to update stock');
        } finally {
            setUpdating(false);
        }
    };

    const getStockStatus = (stock) => {
        if (stock > 5) return { text: 'In Stock', class: 'bg-green-100 text-green-700' };
        if (stock > 0) return { text: 'Low Stock', class: 'bg-yellow-100 text-yellow-700' };
        return { text: 'Out of Stock', class: 'bg-red-100 text-red-700' };
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-4xl animate-spin text-purple-600">&#10052;</div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Stock Management</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Product</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Category</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Stock</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.map((product) => {
                                const status = getStockStatus(product.stock);
                                return (
                                    <tr key={product._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" />
                                                <span className="text-sm font-medium text-gray-800">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{product.category}</td>
                                        <td className="px-4 py-3">
                                            {editId === product._id ? (
                                                <input type="number" value={editStock} onChange={(e) => setEditStock(e.target.value)} min="0"
                                                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
                                            ) : (
                                                <span className="text-sm font-medium text-gray-800">{product.stock}</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${status.class}`}>
                                                {status.text}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {editId === product._id ? (
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleUpdateStock(product._id)} disabled={updating}
                                                        className="bg-green-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-green-700 disabled:opacity-50">
                                                        Save
                                                    </button>
                                                    <button onClick={() => setEditId(null)}
                                                        className="border border-gray-300 px-3 py-1 rounded text-xs font-medium hover:bg-gray-50">
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <button onClick={() => { setEditId(product._id); setEditStock(String(product.stock)); }}
                                                    className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                                                    Update
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {products.length === 0 && (
                    <div className="text-center py-12 text-gray-500">No products found</div>
                )}
            </div>
        </div>
    );
};

export default AdminStock;
