const mongoose = require("mongoose")

const ap_paymentsShema = new mongoose.Schema({
    payment_date: {
        type: String,
        unique: true
    },
    payment_method: {
        type: String,
        enum: ["BANK_TRANSFER", "CHECK", "ONLINE"],
        required: true
    },
    total_amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["DRAFT", "PROCESSING", "COMPLETED", "FAILED"],
        required: true
    },
    bank_reference: {
        type: String,
    },
    journal_id: {
        type:mongoose.Schema.ObjectId,
        ref:'Journal_Header',
        required: true
    }
});

const Ap_payments = mongoose.model("Ap_payments", ap_paymentsShema);

module.exports = Ap_payments;
