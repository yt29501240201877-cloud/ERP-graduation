const Ap_invoices_lines = require("../Models/Ap_invoice_lines")
const Ap_invoices = require("../Models/Ap_invoices")
const mongoose = require("mongoose")
const { ap_linesShema } = require("../Controllers/Validation/ap_invoice_linesValidation")

const addAp_invoiceslines = async (req, res) => {
    try {
        const { error, value } = ap_linesShema.validate(req.body, { abortEarly: false, stripUnknown: true })

        const { description, quantity, unit_price, invoice_id, account_id, tax_rate_id } = value

        if (error) return res.status(400).json({ msg: error.details.map(err => err.message) })

        const ap_invoices = await Ap_invoices.findById(invoice_id)

        if (!ap_invoices) return res.status(400).json({ msg: "Accounts Payable Invoice Isn't Exist" })

        const invoices = await Ap_invoices_lines.create({ description, quantity, unit_price, invoice_id, account_id, tax_rate_id })

        res.status(201).json({ msg: "Accounts Payable Invoice lines Created Successfully", data: invoices })

    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
}

const getallAp_invoices = async (req, res) => {
   try {

    const ap_invoices = await Ap_invoices_lines.find().populate('invoice_id').populate('account_id');

    res.status(200).json({msg:"All Accounts Payable Invoice Retrived", ap_invoices})

   } catch (error) {
        res.status(500).json({msg: "Server Error",error: error.message}) 
   }
}

const getAp_invoicesById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ msg: "Invoice ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid Invoice ID" });
    }

    const invoice = await Ap_invoices.findById(id)
      .populate("vendor_id")
      .populate("period_id")
      .populate("journal_id");

    if (!invoice) {
      return res.status(404).json({ msg: "Account Payable Invoice not found" });
    }

    const lines = await Ap_invoices_lines.find({ invoice_id: id })
      .populate("account_id")
      .populate("tax_rate_id");

    res.status(200).json({
      msg: "Invoice retrieved successfully",
      data: {
        ...invoice.toObject(),
        lines
      }
    });

  } catch (error) {
    res.status(500).json({ 
      msg: "Server Error", 
      error: error.message 
    });
  }
};

const updateAp_invoicesline = async (req, res) => {
  try {

    const {error, value} = ap_linesShema.validate(req.body, {abortEarly: false, stripUnknown: true})

    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({ msg: "ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid Data" });
    }

    if (!Object.keys(updateData).length) {
      return res.status(400).json({ msg: "No data provided for update" });
    }

    const updatedItem = await Ap_invoices_lines.findByIdAndUpdate(id,updateData,{new: true});

    if (!updatedItem) {
      return res.status(404).json({ msg: "Accounts Payable Invoice lines not found" });
    }

    res.status(200).json({msg: "Accounts Payable Invoice lines updated successfully",updatedItem});

  } catch (error) {
    res.status(500).json({msg: "Server Error",error: error.message});
  }
};

module.exports = { addAp_invoiceslines, getallAp_invoices, getAp_invoicesById, updateAp_invoicesline };