const mongoose = require('mongoose');
/**
 * Order Schema
 * This schema defines the structure for an order document in MongoDB.
 * It includes fields for user, course, status, paymentId, orderId, and price.
 */

const OrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    status: { type: String, enum: ['Pending', 'Completed', 'Cancelled'], default: 'Pending' },
    paymentId: { type: String },
    orderId: { type: String },
    price: { type: Number }
}, { timestamps: true });

// OrderSchema.index({ user: 1, course: 1 });

module.exports = mongoose.model('Order', OrderSchema);
