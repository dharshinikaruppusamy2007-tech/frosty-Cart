const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const COUPONS = {
    FROSTY10: { discountPercent: 10, minSubtotal: 0 },
    WELCOME20: { discountPercent: 20, minSubtotal: 300 },
    ICECREAM50: { discountPercent: 5, minSubtotal: 100 }
};

function generateOrderId() {
    const now = new Date();
    const dateStr = now.getFullYear().toString() +
        String(now.getMonth() + 1).padStart(2, '0') +
        String(now.getDate()).padStart(2, '0');
    const random = Math.floor(10000 + Math.random() * 90000);
    return `FRC-${dateStr}-${random}`;
}

const validateCoupon = async (req, res) => {
    try {
        const { code, subtotal } = req.body;
        if (!code) return res.status(400).json({ message: 'Coupon code is required' });

        const coupon = COUPONS[code.toUpperCase()];
        if (!coupon) return res.status(400).json({ valid: false, message: 'Invalid coupon code' });

        if (subtotal < coupon.minSubtotal) {
            return res.status(400).json({
                valid: false,
                message: `Minimum subtotal of ₹${coupon.minSubtotal} required for this coupon`
            });
        }

        const discount = (subtotal * coupon.discountPercent) / 100;
        res.json({
            valid: true,
            code: code.toUpperCase(),
            discountPercent: coupon.discountPercent,
            discount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createOrder = async (req, res) => {
    try {
        const { deliveryAddress, paymentMethod, couponCode } = req.body;

        if (!deliveryAddress) return res.status(400).json({ message: 'Delivery address required' });
        const { fullName, phone, address, city, state, pincode } = deliveryAddress;
        if (!fullName || !phone || !address || !city || !state || !pincode) {
            return res.status(400).json({ message: 'All address fields are required' });
        }

        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        if (!cart || !cart.items.length) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        for (const item of cart.items) {
            if (!item.product) {
                return res.status(400).json({ message: 'Some products are no longer available. Please update your cart.' });
            }
            if (item.product.stock < item.quantity) {
                return res.status(400).json({
                    message: `${item.product.name} has only ${item.product.stock} items available. Please update your cart.`
                });
            }
        }

        let subtotal = 0;
        const orderItems = cart.items.map(item => {
            const price = item.product.price;
            subtotal += price * item.quantity;
            return {
                product: item.product._id,
                name: item.product.name,
                price,
                quantity: item.quantity,
                image: item.product.image
            };
        });

        let discount = 0;
        let validCouponCode = null;
        if (couponCode) {
            const coupon = COUPONS[couponCode.toUpperCase()];
            if (coupon && subtotal >= coupon.minSubtotal) {
                discount = (subtotal * coupon.discountPercent) / 100;
                validCouponCode = couponCode.toUpperCase();
            } else {
                return res.status(400).json({ message: 'Invalid coupon code' });
            }
        }

        const deliveryCharge = subtotal >= 500 ? 0 : 50;
        const totalAmount = subtotal - discount + deliveryCharge;

        let orderId = generateOrderId();
        let existing = await Order.findOne({ orderId });
        while (existing) {
            orderId = generateOrderId();
            existing = await Order.findOne({ orderId });
        }

        const isCOD = !paymentMethod || paymentMethod === 'Cash on Delivery';

        const order = await Order.create({
            orderId,
            user: req.user._id,
            items: orderItems,
            deliveryAddress: { fullName, phone, address, city, state, pincode },
            paymentMethod: paymentMethod || 'Cash on Delivery',
            subtotal,
            discount,
            couponCode: validCouponCode,
            deliveryCharge,
            totalAmount,
            orderStatus: 'Confirmed',
            paymentStatus: isCOD ? 'Pending' : 'Pending',
            transactionId: null,
            paidAt: null
        });

        for (const item of cart.items) {
            await Product.findByIdAndUpdate(item.product._id, {
                $inc: { stock: -item.quantity }
            });
        }

        cart.items = [];
        await cart.save();

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({
            $or: [{ _id: req.params.id }, { orderId: req.params.id }],
            user: req.user._id
        }).populate('user', 'name email');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createOrder, getMyOrders, getOrderById, validateCoupon };
