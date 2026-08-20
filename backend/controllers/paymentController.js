const Order = require('../models/Order');
const PDFDocument = require('pdfkit');

function generateTransactionId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = 'TXN-';
    for (let i = 0; i < 12; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

const processPayment = async (req, res) => {
    try {
        const order = await Order.findOne({
            $or: [{ _id: req.params.orderId }, { orderId: req.params.orderId }],
            user: req.user._id
        });

        if (!order) return res.status(404).json({ message: 'Order not found' });

        if (order.paymentStatus === 'Paid') {
            return res.status(400).json({ message: 'Order is already paid' });
        }

        if (order.paymentMethod === 'Cash on Delivery') {
            order.paymentStatus = 'Pending';
            order.transactionId = null;
            order.paidAt = null;
            await order.save();
            return res.json({
                success: true,
                paymentStatus: 'Pending',
                message: 'Cash on Delivery confirmed. Pay when your order arrives.',
                transactionId: null
            });
        }

        // Mock online payment processing
        const { cardNumber, expiry, cvv } = req.body;
        if (!cardNumber || !expiry || !cvv) {
            return res.status(400).json({ message: 'Card details are required for online payment' });
        }

        // Simulate payment gateway (always succeeds for demo)
        const transactionId = generateTransactionId();
        order.paymentStatus = 'Paid';
        order.transactionId = transactionId;
        order.paidAt = new Date();
        await order.save();

        res.json({
            success: true,
            paymentStatus: 'Paid',
            message: 'Payment successful!',
            transactionId
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPaymentStatus = async (req, res) => {
    try {
        const order = await Order.findOne({
            $or: [{ _id: req.params.orderId }, { orderId: req.params.orderId }],
            user: req.user._id
        }).select('orderId paymentMethod paymentStatus transactionId paidAt totalAmount');

        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const downloadInvoice = async (req, res) => {
    try {
        const order = await Order.findOne({
            $or: [{ _id: req.params.orderId }, { orderId: req.params.orderId }],
            user: req.user._id
        }).populate('user', 'name email');

        if (!order) return res.status(404).json({ message: 'Order not found' });

        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice-${order.orderId}.pdf`);
        doc.pipe(res);

        // Header
        doc.fontSize(28).font('Helvetica-Bold').text('FrostyCart', { align: 'center' });
        doc.moveDown(0.2);
        doc.fontSize(10).font('Helvetica').fillColor('#666').text('Premium Ice Cream Delivery', { align: 'center' });
        doc.moveDown(1);

        // Invoice title
        doc.fontSize(20).font('Helvetica-Bold').fillColor('#333').text('INVOICE', { align: 'center' });
        doc.moveDown(0.5);

        // Divider
        doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke('#ccc');
        doc.moveDown(0.5);

        // Order info
        const infoY = doc.y;
        doc.fontSize(10).font('Helvetica-Bold').fillColor('#333');
        doc.text('Order ID:', 50, infoY, { width: 100 });
        doc.font('Helvetica').text(order.orderId, 150, infoY, { width: 200 });

        doc.font('Helvetica-Bold').text('Date:', 350, infoY, { width: 100 });
        doc.font('Helvetica').text(new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }), 420, infoY, { width: 150 });

        doc.font('Helvetica-Bold').text('Payment Status:', 50, infoY + 18, { width: 100 });
        doc.font('Helvetica').text(order.paymentStatus, 150, infoY + 18, { width: 200 });

        doc.font('Helvetica-Bold').text('Payment Method:', 350, infoY + 18, { width: 100 });
        doc.font('Helvetica').text(order.paymentMethod, 420, infoY + 18, { width: 150 });

        if (order.transactionId) {
            doc.font('Helvetica-Bold').text('Transaction ID:', 50, infoY + 36, { width: 100 });
            doc.font('Helvetica').text(order.transactionId, 150, infoY + 36, { width: 200 });
        }

        doc.y = infoY + 55;

        // Delivery address
        doc.font('Helvetica-Bold').fillColor('#333').text('Delivery Address:', 50);
        doc.moveDown(0.2);
        doc.font('Helvetica').fontSize(9).fillColor('#555');
        doc.text(order.deliveryAddress.fullName, 50);
        doc.text(order.deliveryAddress.phone, 50);
        doc.text(order.deliveryAddress.address, 50);
        doc.text(`${order.deliveryAddress.city}, ${order.deliveryAddress.state} ${order.deliveryAddress.pincode}`, 50);
        doc.moveDown(1);

        // Items table header
        doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke('#ccc');
        doc.moveDown(0.3);
        const tableY = doc.y;
        doc.fontSize(10).font('Helvetica-Bold').fillColor('#333');
        doc.text('Item', 50, tableY, { width: 200 });
        doc.text('Qty', 300, tableY, { width: 50, align: 'center' });
        doc.text('Price', 360, tableY, { width: 80, align: 'right' });
        doc.text('Total', 460, tableY, { width: 85, align: 'right' });
        doc.moveDown(0.5);
        doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke('#ccc');
        doc.moveDown(0.3);

        // Items
        doc.font('Helvetica').fontSize(9).fillColor('#444');
        for (const item of order.items) {
            const rowY = doc.y;
            doc.text(item.name, 50, rowY, { width: 200 });
            doc.text(String(item.quantity), 300, rowY, { width: 50, align: 'center' });
            doc.text(`Rs.${item.price.toFixed(2)}`, 360, rowY, { width: 80, align: 'right' });
            doc.text(`Rs.${(item.price * item.quantity).toFixed(2)}`, 460, rowY, { width: 85, align: 'right' });
            doc.moveDown(0.6);
        }

        doc.moveDown(0.3);
        doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke('#ccc');
        doc.moveDown(0.5);

        // Totals
        const totalsX = 380;
        const totalsValX = 460;
        const totalsY = doc.y;
        doc.font('Helvetica').fontSize(10).fillColor('#555');
        doc.text('Subtotal:', totalsX, totalsY, { width: 70, align: 'left' });
        doc.text(`Rs.${order.subtotal.toFixed(2)}`, totalsValX, totalsY, { width: 85, align: 'right' });
        doc.y = totalsY + 16;

        if (order.discount > 0) {
            doc.fillColor('#22c55e').text(`Discount (${order.couponCode}):`, totalsX, doc.y, { width: 70, align: 'left' });
            doc.text(`-Rs.${order.discount.toFixed(2)}`, totalsValX, doc.y, { width: 85, align: 'right' });
            doc.y += 16;
        }

        doc.fillColor('#555').text('Delivery:', totalsX, doc.y, { width: 70, align: 'left' });
        doc.text(order.deliveryCharge === 0 ? 'FREE' : `Rs.${order.deliveryCharge.toFixed(2)}`, totalsValX, doc.y, { width: 85, align: 'right' });
        doc.y += 20;

        doc.moveTo(totalsX, doc.y).lineTo(545, doc.y).stroke('#ccc');
        doc.y += 5;

        doc.font('Helvetica-Bold').fontSize(13).fillColor('#333');
        doc.text('Total:', totalsX, doc.y, { width: 70, align: 'left' });
        doc.text(`Rs.${order.totalAmount.toFixed(2)}`, totalsValX, doc.y, { width: 85, align: 'right' });
        doc.y += 30;

        // Footer
        doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke('#ccc');
        doc.moveDown(0.5);
        doc.fontSize(9).font('Helvetica').fillColor('#888').text('Thank you for ordering from FrostyCart!', { align: 'center' });
        doc.text('This is a computer-generated invoice.', { align: 'center' });

        doc.end();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { processPayment, getPaymentStatus, downloadInvoice };
