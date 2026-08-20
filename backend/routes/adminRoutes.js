const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
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
} = require('../controllers/adminController');

router.use(protect, adminOnly);

router.get('/dashboard', getDashboardStats);

router.get('/products', getAllProducts);
router.post('/products', createProduct);
router.get('/products/:id', getProductById);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

router.get('/categories', getAllCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

router.get('/customers', getAllCustomers);

router.get('/orders', getAllOrders);
router.get('/orders/:orderId', getOrderById);
router.put('/orders/:orderId/status', updateOrderStatus);

router.get('/stock', getStock);
router.put('/stock/:productId', updateStock);

module.exports = router;
