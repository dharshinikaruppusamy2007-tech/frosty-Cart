import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

const API = 'http://localhost:5000';

export const CartProvider = ({ children }) => {
    const { user, token } = useAuth();
    const [cart, setCart] = useState({ items: [] });
    const [cartLoading, setCartLoading] = useState(false);

    const fetchCart = useCallback(async () => {
        if (!user || !token) {
            setCart({ items: [] });
            return;
        }
        try {
            setCartLoading(true);
            const res = await fetch(`${API}/api/cart`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setCart(data);
            }
        } catch (err) {
            console.error('Failed to fetch cart', err);
        } finally {
            setCartLoading(false);
        }
    }, [user, token]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = async (productId, quantity = 1) => {
        if (!user || !token) return false;
        try {
            const res = await fetch(`${API}/api/cart/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ productId, quantity })
            });
            if (res.ok) {
                const data = await res.json();
                setCart(data);
                return true;
            }
            return false;
        } catch (err) {
            console.error('Failed to add to cart', err);
            return false;
        }
    };

    const updateQuantity = async (productId, quantity) => {
        if (!user || !token) return;
        try {
            const res = await fetch(`${API}/api/cart/item/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ quantity })
            });
            if (res.ok) {
                const data = await res.json();
                setCart(data);
            }
        } catch (err) {
            console.error('Failed to update cart', err);
        }
    };

    const removeFromCart = async (productId) => {
        if (!user || !token) return;
        try {
            const res = await fetch(`${API}/api/cart/item/${productId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setCart(data);
            }
        } catch (err) {
            console.error('Failed to remove from cart', err);
        }
    };

    const clearCart = async () => {
        if (!user || !token) return;
        try {
            await fetch(`${API}/api/cart/clear`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            setCart({ items: [] });
        } catch (err) {
            console.error('Failed to clear cart', err);
        }
    };

    const cartCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);
    const cartTotal = cart.items.reduce((acc, item) => {
        if (item.product) acc += item.product.price * item.quantity;
        return acc;
    }, 0);

    return (
        <CartContext.Provider value={{
            cart, cartLoading, cartCount, cartTotal,
            addToCart, updateQuantity, removeFromCart, clearCart, fetchCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
