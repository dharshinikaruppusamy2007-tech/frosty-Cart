const Cart = require('../models/Cart');
const Product = require('../models/Product');

const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        if (product.stock <= 0) return res.status(400).json({ message: 'Product is out of stock' });

        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

        const existingIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

        if (existingIndex > -1) {
            const newQty = cart.items[existingIndex].quantity + quantity;
            if (newQty > product.stock) {
                return res.status(400).json({ message: `Only ${product.stock} items are available.` });
            }
            cart.items[existingIndex].quantity = newQty;
        } else {
            if (quantity > product.stock) {
                return res.status(400).json({ message: `Only ${product.stock} items are available.` });
            }
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();
        cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const item = cart.items.find(
            item => item.product.toString() === req.params.productId
        );
        if (!item) return res.status(404).json({ message: 'Item not in cart' });

        const product = await Product.findById(req.params.productId);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        if (quantity > product.stock) {
            return res.status(400).json({ message: `Only ${product.stock} items are available.` });
        }
        if (quantity < 1) {
            return res.status(400).json({ message: 'Quantity must be at least 1' });
        }

        item.quantity = quantity;
        await cart.save();
        const updated = await Cart.findOne({ user: req.user._id }).populate('items.product');
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        cart.items = cart.items.filter(
            item => item.product.toString() !== req.params.productId
        );
        await cart.save();
        const updated = await Cart.findOne({ user: req.user._id }).populate('items.product');
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (cart) {
            cart.items = [];
            await cart.save();
        }
        res.json({ message: 'Cart cleared' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
