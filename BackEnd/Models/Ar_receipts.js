const mongoose = require("mongoose")

const ar_receiptsShema = new mongoose.Schema({
    receipt_date: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    unapplied_amount: {
        type: Number,
        required: true
    },
    payment_method: {
        type: String,
        enum: ["BANK", "CASH", "CARD", "ONLINE"],
        required: true
    },
    ar_invoices_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Ar_invoices',
        required: true
    },
    customer_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Customers',
        required: true
    },
    journal_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Journal_Header'
    }
});

const Ar_receipts = mongoose.model("Ar_receipts", ar_receiptsShema);

module.exports = Ar_receipts;
