const mongoose = require("mongoose")

const ap_linesShema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    unit_price: {
        type: Number,
        required: true
    },
    invoice_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Ap_invoices',
        required: true
    },
    account_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'GlAccount',
        required: true
    },
    tax_rate_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tax_rate',
    }
});

const Ap_invoice_lines = mongoose.model("Ap_invoice_lines", ap_linesShema);

module.exports = Ap_invoice_lines;
