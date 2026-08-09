const mongoose = require("mongoose")
const Counter = require("./Counter");
const { required, number } = require("joi");

const ap_invoicesShema = new mongoose.Schema({
    invoice_number: {
        type: String,
        unique: true
    },
    invoice_date: {
        type: String,
        required: true
    },
    due_date: {
        type: String,
        required: true
    },
    subtotal: {
        type: Number,
        required: true
    },
    tax_amount: {
        type: Number,
        required: true
    },
    total_amount: {
        type: Number,
        required: true
    },
    paid_amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["DRAFT", "PENDING", "APPROVED", "PAID", "CANCELLED"],
        required: true
    },
    vendor_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Vendors',
        required: true
    },
    period_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Accounting_Periods',
        required: true
    },
    journal_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Journal_Header'
    }
});

ap_invoicesShema.pre("save", async function () {
  try {
    if (!this.isNew) return ;

    const counter = await Counter.findOneAndUpdate(
      { name: "Ap Invoices" },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );
    this.invoice_number = `AP-${counter.value.toString().padStart(5, "0")}`;

  } catch (err) {
    throw err;
  }
});

const Ap_invoices = mongoose.model("Ap_invoices", ap_invoicesShema);

module.exports = Ap_invoices;
