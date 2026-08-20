import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

const API = 'http://localhost:5000';

export const WishlistProvider = ({ children }) => {
    const { user, token } = useAuth();
    const [wishlist, setWishlist] = useState({ products: [] });
    const [wishlistLoading, setWishlistLoading] = useState(false);

    const fetchWishlist = useCallback(async () => {
        if (!user || !token) {
            setWishlist({ products: [] });
            return;
        }
        try {
            setWishlistLoading(true);
            const res = await fetch(`${API}/api/wishlist`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setWishlist(data);
            }
        } catch (err) {
            console.error('Failed to fetch wishlist', err);
        } finally {
            setWishlistLoading(false);
        }
    }, [user, token]);

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    const addToWishlist = async (productId) => {
        if (!user || !token) return { success: false, requiresAuth: true };
        try {
            const res = await fetch(`${API}/api/wishlist/${productId}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setWishlist(data);
                return { success: true };
            }
            const data = await res.json();
            if (res.status === 400 && data.message === 'Product already in wishlist') {
                return { success: false, alreadyExists: true };
            }
            return { success: false };
        } catch (err) {
            console.error('Failed to add to wishlist', err);
            return { success: false };
        }
    };

    const removeFromWishlist = async (productId) => {
        if (!user || !token) return;
        try {
            const res = await fetch(`${API}/api/wishlist/${productId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setWishlist(data);
            }
        } catch (err) {
            console.error('Failed to remove from wishlist', err);
        }
    };

    const isInWishlist = (productId) => {
        return wishlist.products.some(p => {
            if (typeof p === 'string') return p === productId;
            return p._id === productId;
        });
    };

    const wishlistCount = wishlist.products.length;

    return (
        <WishlistContext.Provider value={{
            wishlist, wishlistLoading, wishlistCount,
            addToWishlist, removeFromWishlist, isInWishlist, fetchWishlist
        }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
