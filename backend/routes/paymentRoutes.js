const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { processPayment, getPaymentStatus, downloadInvoice } = require('../controllers/paymentController');

router.post('/:orderId/process', protect, processPayment);
router.get('/:orderId/status', protect, getPaymentStatus);
router.get('/:orderId/invoice', protect, downloadInvoice);

module.exports = router;
