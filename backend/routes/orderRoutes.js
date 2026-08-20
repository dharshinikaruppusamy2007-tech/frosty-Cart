const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrderById, validateCoupon } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.post('/coupons/validate', protect, validateCoupon);
router.post('/', protect, createOrder);
router.get('/', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

module.exports = router;
