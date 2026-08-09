const Ar_receipts = require("../Models/Ar_receipts")
const Ar_invoices = require("../Models/Ar_invoices")
const Customers = require('../Models/Customers');
const mongoose = require("mongoose")
const { ar_receiptsShema } = require("../Controllers/Validation/ar_receiptsValidation")

const addAr_receipts = async (req, res) => {
    try {
        const { error, value } = ar_receiptsShema.validate(req.body, { abortEarly: false, stripUnknown: true })

        const { receipt_date, amount, unapplied_amount, payment_method, customer_id, journal_id, ar_invoices_id } = value

        if (error) return res.status(400).json({ msg: error.details.map(err => err.message) })

        const receipts = await Ar_receipts.create({ receipt_date, amount, unapplied_amount, payment_method, customer_id, journal_id, ar_invoices_id })

        res.status(201).json({ msg: "Cash Receipt Created Successfully", data: receipts })

    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
}

const getallAr_receipts = async (req, res) => {
    try {

        const receipts = await Ar_receipts.find();

        res.status(200).json({ msg: "All Cash Receipts Retrived", receipts })

    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message })
    }
}

const getAr_receiptsBycustomer = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ msg: "Customer ID is required" });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: "Invalid Customer ID" });
        }

        const lines = await Ar_receipts.find({ customer_id: id }).populate("customer_id");

        res.status(200).json({ msg: "Receipts retrieved successfully", data: lines });

    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};

const getAR_invoicesById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ msg: "Invoice ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid Invoice ID" });
    }

    const invoice = await Ar_invoices.findById(id);

    if (!invoice) {
      return res.status(404).json({ msg: "Account Receivable Invoice not found" });
    }

    const Receipts = await Ar_receipts.find({ ar_invoices_id: id }).populate("customer_id");

    res.status(200).json({
      msg: "Invoice retrieved successfully",
      data: {
        ...invoice.toObject(),
        Receipts
      }
    });

  } catch (error) {
    res.status(500).json({ 
      msg: "Server Error", 
      error: error.message 
    });
  }
};

module.exports = { addAr_receipts, getallAr_receipts, getAr_receiptsBycustomer, getAR_invoicesById };