import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AdminCategories = () => {
    const { token } = useAuth();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newName, setNewName] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState('');
    const [editDesc, setEditDesc] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [deleteId, setDeleteId] = useState(null);
    const [deleteError, setDeleteError] = useState('');

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/categories`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) setCategories(await res.json());
        } catch (err) {
            console.error('Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCategories(); }, [token]);

    const handleAdd = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name: newName, description: newDesc })
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.message);
                return;
            }

            setSuccess('Category added successfully.');
            setNewName('');
            setNewDesc('');
            fetchCategories();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Server error');
        }
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/categories/${editId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name: editName, description: editDesc })
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.message);
                return;
            }

            setSuccess('Category updated successfully.');
            setEditId(null);
            fetchCategories();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Server error');
        }
    };

    const handleDelete = async (id) => {
        setDeleteError('');
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/categories/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = await res.json();
            if (!res.ok) {
                setDeleteError(data.message);
                return;
            }

            setDeleteId(null);
            setSuccess('Category deleted successfully.');
            fetchCategories();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setDeleteError('Server error');
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
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Categories</h1>

            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
            {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">{success}</div>}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 max-w-2xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Category</h3>
                <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
                    <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} required placeholder="Category name"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none" />
                    <input type="text" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Description (optional)"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none" />
                    <button type="submit"
                        className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition whitespace-nowrap">
                        Add Category
                    </button>
                </form>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Description</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {categories.map((cat) => (
                            <tr key={cat._id} className="hover:bg-gray-50">
                                {editId === cat._id ? (
                                    <td colSpan={3} className="px-4 py-3">
                                        <form onSubmit={handleEdit} className="flex flex-col sm:flex-row gap-3 items-end">
                                            <div className="flex-1">
                                                <label className="text-xs text-gray-500">Name</label>
                                                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
                                            </div>
                                            <div className="flex-1">
                                                <label className="text-xs text-gray-500">Description</label>
                                                <input type="text" value={editDesc} onChange={(e) => setEditDesc(e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
                                            </div>
                                            <div className="flex gap-2">
                                                <button type="submit" className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-700">Save</button>
                                                <button type="button" onClick={() => setEditId(null)} className="border border-gray-300 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
                                            </div>
                                        </form>
                                    </td>
                                ) : (
                                    <>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-800">{cat.name}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{cat.description || '-'}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <button onClick={() => { setEditId(cat._id); setEditName(cat.name); setEditDesc(cat.description); }}
                                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                                                <button onClick={() => setDeleteId(cat._id)}
                                                    className="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
                                            </div>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {categories.length === 0 && <div className="text-center py-12 text-gray-500">No categories found</div>}
            </div>

            {deleteId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Confirm Delete</h3>
                        <p className="text-gray-600 mb-2">Are you sure you want to delete this category?</p>
                        {deleteError && <p className="text-red-600 text-sm mb-4">{deleteError}</p>}
                        <div className="flex gap-3 justify-end">
                            <button onClick={() => { setDeleteId(null); setDeleteError(''); }}
                                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition text-sm font-medium">Cancel</button>
                            <button onClick={() => handleDelete(deleteId)}
                                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition text-sm font-medium">Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategories;
