const Product = require('../models/Product');

const getProducts = async (req, res) => {
    try {
        const { category, search, minPrice, maxPrice } = req.query;
        let filter = {};

        if (category && category !== 'All') {
            filter.category = category;
        }

        if (search) {
            const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            filter.$or = [
                { name: { $regex: escaped, $options: 'i' } },
                { description: { $regex: escaped, $options: 'i' } },
                { category: { $regex: escaped, $options: 'i' } }
            ];
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        const products = await Product.find(filter).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching products' });
    }
};

const getProductById = async (req, res) => {
    try {
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(500).json({ message: 'Server error while fetching product' });
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await Product.distinct('category');
        res.json(categories.sort());
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching categories' });
    }
};

module.exports = { getProducts, getProductById, getCategories };
