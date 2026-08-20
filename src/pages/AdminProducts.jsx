import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminProducts = () => {
    const { token } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState(null);

    const fetchProducts = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/admin/products', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setProducts(await res.json());
            }
        } catch (err) {
            console.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProducts(); }, [token]);

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`http://localhost:5000/api/admin/products/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setProducts(products.filter(p => p._id !== id));
                setDeleteId(null);
            }
        } catch (err) {
            console.error('Failed to delete product');
        }
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
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Products</h1>
                <Link
                    to="/admin/products/add"
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition"
                >
                    + Add Product
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Image</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Category</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Price</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Stock</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                                    </td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{product.name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{product.category}</td>
                                    <td className="px-4 py-3 text-sm font-medium text-gray-800">Rs.{product.price}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{product.stock}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                                            product.stock > 5 ? 'bg-green-100 text-green-700' :
                                            product.stock > 0 ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                            {product.stock > 5 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <Link
                                                to={`/admin/products/edit/${product._id}`}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => setDeleteId(product._id)}
                                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {products.length === 0 && (
                    <div className="text-center py-12 text-gray-500">No products found</div>
                )}
            </div>

            {deleteId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Confirm Delete</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to delete this product?</p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition text-sm font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteId)}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition text-sm font-medium"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
