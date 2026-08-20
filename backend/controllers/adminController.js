const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');

const getDashboardStats = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalCustomers = await User.countDocuments({ role: 'customer' });
        const totalOrders = await Order.countDocuments();

        const revenueResult = await Order.aggregate([
            { $match: { paymentStatus: 'Paid' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        const pendingOrders = await Order.countDocuments({ orderStatus: 'Confirmed' });
        const lowStockProducts = await Product.find({ stock: { $gt: 0, $lte: 5 } })
            .select('name stock')
            .sort({ stock: 1 });

        const recentOrders = await Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            totalProducts,
            totalCustomers,
            totalOrders,
            totalRevenue,
            pendingOrders,
            lowStockProducts,
            recentOrders
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, description, price, image, category, stock, rating } = req.body;

        if (!name || !description || !price || !image || !category) {
            return res.status(400).json({ message: 'Please fill all required fields' });
        }

        if (price < 0) {
            return res.status(400).json({ message: 'Price cannot be negative' });
        }

        if (stock !== undefined && stock < 0) {
            return res.status(400).json({ message: 'Stock cannot be negative' });
        }

        const product = await Product.create({
            name,
            description,
            price,
            image,
            category,
            stock: stock || 0,
            rating: rating || 4.5
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const { name, description, price, image, category, stock, rating } = req.body;

        if (price !== undefined && price < 0) {
            return res.status(400).json({ message: 'Price cannot be negative' });
        }

        if (stock !== undefined && stock < 0) {
            return res.status(400).json({ message: 'Stock cannot be negative' });
        }

        if (name) product.name = name;
        if (description) product.description = description;
        if (price !== undefined) product.price = price;
        if (image) product.image = image;
        if (category) product.category = category;
        if (stock !== undefined) product.stock = stock;
        if (rating !== undefined) product.rating = rating;

        const updated = await product.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Category name is required' });
        }

        const exists = await Category.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (exists) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const category = await Category.create({ name, description: description || '' });
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const { name, description } = req.body;
        if (name) category.name = name;
        if (description !== undefined) category.description = description;

        const updated = await category.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const productsUsing = await Product.countDocuments({ category: category.name });
        if (productsUsing > 0) {
            return res.status(400).json({
                message: `Cannot delete. ${productsUsing} product(s) use this category.`
            });
        }

        await Category.findByIdAndDelete(req.params.id);
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllCustomers = async (req, res) => {
    try {
        const customers = await User.find({ role: 'customer' })
            .select('-password')
            .sort({ createdAt: -1 });
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId)
            .populate('user', 'name email phone');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid order status' });
        }

        const order = await Order.findById(req.params.orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.orderStatus = status;
        const updated = await order.save();

        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getStock = async (req, res) => {
    try {
        const products = await Product.find()
            .select('name stock category image')
            .sort({ stock: 1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateStock = async (req, res) => {
    try {
        const { stock } = req.body;

        if (stock === undefined || stock < 0) {
            return res.status(400).json({ message: 'Invalid stock value' });
        }

        const product = await Product.findById(req.params.productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.stock = stock;
        const updated = await product.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDashboardStats,
    getAllProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct,
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getAllCustomers,
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    getStock,
    updateStock
};
