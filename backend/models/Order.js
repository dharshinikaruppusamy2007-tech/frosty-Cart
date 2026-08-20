const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    name: String,
    price: Number,
    quantity: Number,
    image: String
});

const orderSchema = mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [orderItemSchema],
    deliveryAddress: {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true }
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['Cash on Delivery', 'Online Payment']
    },
    subtotal: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    couponCode: {
        type: String,
        default: null
    },
    deliveryCharge: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Paid', 'Failed', 'Refunded']
    },
    transactionId: {
        type: String,
        default: null
    },
    paidAt: {
        type: Date,
        default: null
    },
    orderStatus: {
        type: String,
        default: 'Confirmed',
        enum: ['Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
