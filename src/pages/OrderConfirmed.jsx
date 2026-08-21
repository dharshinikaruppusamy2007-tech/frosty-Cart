import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Package, MapPin, CreditCard, Calendar, Tag, Download, Printer, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const API = import.meta.env.VITE_API_URL;

const OrderConfirmed = () => {
    const { orderId } = useParams();
    const { token } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const generateInvoice = (action = 'download') => {
        if (!order) return;

        const doc = new jsPDF();

        // Header
        doc.setFontSize(22);
        doc.setTextColor(155, 89, 182);
        doc.text('FrostyCart', 14, 20);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text('Premium Handcrafted Ice Cream', 14, 26);
        doc.text('Email: support@frostycart.com', 14, 32);

        // Invoice info
        doc.setFontSize(16);
        doc.setTextColor(0);
        doc.text('INVOICE', 150, 20);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Order ID: ${order.orderId}`, 150, 28);
        doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 150, 34);
        doc.text(`Status: ${order.orderStatus}`, 150, 40);

        // Customer Info
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text('Bill To:', 14, 45);

        doc.setFontSize(10);
        doc.setTextColor(100);
        const address = order.deliveryAddress;

        let yAddr = 52;
        doc.text(address.fullName, 14, yAddr); yAddr += 5;
        if (order.user?.email) {
            doc.text(order.user.email, 14, yAddr); yAddr += 5;
        }
        doc.text(address.phone, 14, yAddr); yAddr += 5;
        doc.text(address.address, 14, yAddr); yAddr += 5;
        doc.text(`${address.city}, ${address.state} ${address.pincode}`, 14, yAddr);

        // Products Table
        const tableColumn = ["Product", "Price", "Qty", "Total"];
        const tableRows = [];

        order.items.forEach(item => {
            tableRows.push([
                item.name,
                `Rs ${item.price.toFixed(2)}`,
                item.quantity.toString(),
                `Rs ${(item.price * item.quantity).toFixed(2)}`
            ]);
        });

        doc.autoTable({
            startY: Math.max(90, yAddr + 10),
            head: [tableColumn],
            body: tableRows,
            theme: 'striped',
            headStyles: { fillColor: [155, 89, 182] },
        });

        const finalY = doc.lastAutoTable.finalY || 90;

        // Totals
        doc.setFontSize(10);
        doc.setTextColor(0);

        const subtotalText = `Subtotal: Rs ${order.subtotal.toFixed(2)}`;
        const discountText = order.discount > 0 ? `Discount (${order.couponCode || ''}): -Rs ${order.discount.toFixed(2)}` : '';
        const deliveryText = `Delivery: ${order.deliveryCharge === 0 ? 'FREE' : `Rs ${order.deliveryCharge.toFixed(2)}`}`;
        const totalText = `Final Total: Rs ${order.totalAmount.toFixed(2)}`;

        let yPos = finalY + 10;
        doc.text(subtotalText, 140, yPos);
        if (discountText) {
            yPos += 6;
            doc.text(discountText, 140, yPos);
        }
        yPos += 6;
        doc.text(deliveryText, 140, yPos);

        yPos += 10;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(totalText, 140, yPos);

        // Footer
        const pageHeight = doc.internal.pageSize.height;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(128, 128, 128);
        doc.text('Thank you for shopping with FrostyCart!', 105, pageHeight - 15, { align: 'center' });

        if (action === 'download') {
            doc.save(`Invoice-${order.orderId}.pdf`);
        } else if (action === 'view') {
            window.open(doc.output('bloburl'), '_blank');
        } else if (action === 'print') {
            doc.autoPrint();
            window.open(doc.output('bloburl'), '_blank');
        }
    };

    const handleDownloadInvoice = () => generateInvoice('download');
    const handleViewInvoice = () => generateInvoice('view');
    const handlePrintInvoice = () => generateInvoice('print');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(`${API}/api/orders/${orderId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    setOrder(await res.json());
                }
            } catch (err) {
                console.error('Failed to fetch order', err);
            } finally {
                setLoading(false);
            }
        };
        if (token) fetchOrder();
    }, [orderId, token]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
                <div className="text-6xl animate-spin">{'\uD83C\uDF66'}</div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">Order not found</p>
                    <Link to="/" className="text-[#9B59B6] font-bold hover:underline">Go Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FFF8F0] py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-[#F5E6D3] text-center mb-8">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={40} className="text-green-500" />
                    </div>
                    <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Order Placed Successfully! {'\uD83C\uDF89'}</h1>
                    <p className="text-gray-500 mb-4">Thank you for your order. We'll get it to you soon!</p>
                    <p className="text-sm text-gray-400">Order ID: <span className="font-mono font-bold text-[#9B59B6]">{order.orderId}</span></p>
                </div>

                {/* Ordered Products */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#F5E6D3] mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Package size={20} className="text-[#9B59B6]" />
                        <h3 className="font-display font-bold text-lg text-gray-800">Ordered Products</h3>
                    </div>
                    <div className="space-y-3">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                {item.image && <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover" />}
                                <div className="flex-1">
                                    <p className="font-medium text-gray-800">{item.name}</p>
                                    <p className="text-gray-500 text-sm">{'\u20B9'}{item.price} {'\u00D7'} {item.quantity}</p>
                                </div>
                                <span className="font-medium">{'\u20B9'}{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Price Breakdown */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#F5E6D3] mb-6">
                    <h3 className="font-display font-bold text-lg text-gray-800 mb-4">Price Details</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>{'\u20B9'}{order.subtotal.toFixed(2)}</span>
                        </div>
                        {order.discount > 0 && (
                            <div className="flex justify-between text-green-600">
                                <span className="flex items-center gap-1">
                                    <Tag size={14} />
                                    Discount ({order.couponCode})
                                </span>
                                <span>-{'\u20B9'}{order.discount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-gray-600">
                            <span>Delivery Charge</span>
                            <span>
                                {order.deliveryCharge === 0 ? (
                                    <span className="text-green-600 font-medium">FREE</span>
                                ) : (
                                    `₹${order.deliveryCharge.toFixed(2)}`
                                )}
                            </span>
                        </div>
                        <hr className="border-gray-100" />
                        <div className="flex justify-between font-display font-bold text-xl text-gray-900">
                            <span>Final Amount</span>
                            <span>{'\u20B9'}{order.totalAmount.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#F5E6D3]">
                        <div className="flex items-center gap-2 mb-3">
                            <MapPin size={18} className="text-[#9B59B6]" />
                            <h4 className="font-display font-bold text-gray-800">Delivery Address</h4>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                            <p className="font-medium">{order.deliveryAddress.fullName}</p>
                            <p>{order.deliveryAddress.phone}</p>
                            <p>{order.deliveryAddress.address}</p>
                            <p>{order.deliveryAddress.city}, {order.deliveryAddress.state} {order.deliveryAddress.pincode}</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#F5E6D3]">
                        <div className="flex items-center gap-2 mb-3">
                            <CreditCard size={18} className="text-[#9B59B6]" />
                            <h4 className="font-display font-bold text-gray-800">Payment Details</h4>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                            <p>Method: <span className="font-medium">{order.paymentMethod}</span></p>
                            <p>Status: <span className={`font-medium ${order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-amber-600'}`}>{order.paymentStatus}</span></p>
                            {order.transactionId && <p>Transaction: <span className="font-mono text-xs">{order.transactionId}</span></p>}
                            <p className="font-bold text-gray-800">Total: {'\u20B9'}{order.totalAmount.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#F5E6D3] mb-8">
                    <div className="flex items-center gap-2 mb-2">
                        <Calendar size={18} className="text-[#9B59B6]" />
                        <h4 className="font-display font-bold text-gray-800">Order Status</h4>
                    </div>
                    <p className="text-sm text-gray-600">Date: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    <p className="text-sm font-medium text-green-600 mt-1">Status: {order.orderStatus}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <button onClick={handleViewInvoice} className="flex-1 py-4 text-center border-2 border-[#9B59B6] text-[#9B59B6] rounded-xl font-bold text-lg hover:bg-[#FFF8F0] transition-colors flex items-center justify-center gap-2">
                        <FileText size={20} />
                        View Bill
                    </button>
                    <button onClick={handleDownloadInvoice} className="flex-1 py-4 text-center bg-gradient-to-r from-[#9B59B6] to-[#E74C8B] text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center justify-center gap-2">
                        <Download size={20} />
                        Download
                    </button>
                    <button onClick={handlePrintInvoice} className="flex-1 py-4 text-center border-2 border-gray-200 text-gray-600 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                        <Printer size={20} />
                        Print
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/products" className="flex-1 py-4 text-center border-2 border-gray-200 text-gray-600 rounded-xl font-bold text-lg hover:bg-gray-50 transition-colors">
                        Continue Shopping
                    </Link>
                    <Link to="/orders" className="flex-1 py-4 text-center bg-gradient-to-r from-[#9B59B6] to-[#E74C8B] text-white rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all">
                        View Order History
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmed;
