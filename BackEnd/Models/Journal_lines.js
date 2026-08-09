const { number } = require("joi");
const mongoose = require("mongoose")

const journal_lShema = new mongoose.Schema({
    debit_amount: {
        type: Number,
        required: true,
        default: 0.00
    },
    credit_amount: {
        type: Number,
        required: true,
        default: 0.00
    },
    description: {
        type: String
    },
    journal_id:[{
        type:mongoose.Schema.ObjectId,
        ref:'Journal_Header',
        required: true
    }],
    glaccount_id: [{
        type:mongoose.Schema.ObjectId,
        ref:'GlAccounts',
        required: true
    }]
}, {timestamps: true});

const Journal_lines = mongoose.model("Journal_lines", journal_lShema);

module.exports = Journal_lines;






