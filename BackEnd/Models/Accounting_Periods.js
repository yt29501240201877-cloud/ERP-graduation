const mongoose = require("mongoose")

const acc_perShema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    start_date: {
        type: String,
        required: true
    },
    end_date: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["OPEN", "CLOSED", "LOCKED"],
        required: true
    },
    closed_at: {
        type: String,
        required: true
    },
    closed_by: [{
        type:mongoose.Schema.ObjectId,
        ref:'Users',
        required: true
    }]
}, {timestamps: true});

const Accounting_Periods = mongoose.model("Accounting_Periods", acc_perShema);

module.exports = Accounting_Periods;