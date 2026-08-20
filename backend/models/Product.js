const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a product name']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    image: {
        type: String,
        required: [true, 'Please add an image URL']
    },
    category: {
        type: String,
        required: [true, 'Please add a category']
    },
    stock: {
        type: Number,
        required: true,
        default: 50
    },
    rating: {
        type: Number,
        default: 4.5
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
