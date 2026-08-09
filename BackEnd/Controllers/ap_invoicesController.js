const Ap_invoices = require("../Models/Ap_invoices")
const Ap_invoices_lines = require("../Models/Ap_invoice_lines")
const Vendors = require('../Models/Vendors');
const mongoose = require("mongoose")
const { ap_invoicesShema } = require("../Controllers/Validation/ap_invoicesValidation")

const addAp_invoices = async (req, res) => {
    try {
        const { error, value } = ap_invoicesShema.validate(req.body, { abortEarly: false, stripUnknown: true })

        const { invoice_number, invoice_date, due_date, subtotal, status, tax_amount, total_amount, paid_amount, vendor_id, journal_id, period_id } = value

        if (error) return res.status(400).json({ msg: error.details.map(err => err.message) })

        const ap_invoices = await Ap_invoices.findOne({ invoice_number })

        if (ap_invoices) return res.status(400).json({ msg: "Accounts Payable Invoice Already Exist" })

        const invoices = await Ap_invoices.create({ invoice_date, due_date, subtotal, status, tax_amount, total_amount, paid_amount, vendor_id, journal_id, period_id })

        res.status(201).json({ msg: "Accounts Payable Invoice Created Successfully", data: invoices })

    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
}

const getallAp_invoices = async (req, res) => {
    try {

        const ap_invoices = await Ap_invoices.find().populate('vendor_id');

        res.status(200).json({ msg: "All Accounts Payable Invoice Retrived", ap_invoices })

    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message })
    }
}

const getJAPById = async (req, res) => {
    try {

        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ msg: "ID is required" });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: "Invalid ID" });
        }

        const data = await Ap_invoices.findById(id).populate('vendor_id');

        if (!data) {
            return res.status(404).json({ msg: "Account Payable Invoice not found" });
        }

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
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
      .populate("account_id");
    //   .populate("tax_rate_id");

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

const getJAPByStatus = async (req, res) => {
    try {

        const { status } = req.params;

        if (!status) {
            return res.status(400).json({ msg: "Status is required" });
        }

        const data = await Ap_invoices.find({ status: status });

        if (!data) {
            return res.status(404).json({ msg: "Account Payable Invoice not found", data });
        }

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
}

const updatestatus = async (req, res) => {
    try {

        const { id } = req.params;
        const { status } = req.body;

        if (!id) {
            return res.status(400).json({ msg: "Account Payable Invoice ID is required" });
        }

        const ap_invoices = await Ap_invoices.findByIdAndUpdate(id, { status }, { new: true });

        if (!ap_invoices) {
            return res.status(404).json({ msg: "Account Payable Invoice not found" });
        }

        res.status(200).json({ msg: "Status Updated successfully", Ap_invoices: ap_invoices });

    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message })
    }
}

const getVendorAgingSummary = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: "Invalid Vendor ID" });
        }

        const vendor = await Vendors.findById(id);
        if (!vendor) {
            return res.status(404).json({ msg: "Vendor not found" });
        }

        const asOfDate = new Date();

        const invoices = await Ap_invoices.find({ vendor_id: id, status: { $in: ["PENDING", "APPROVED"] } });

        let totalOutstanding = 0;

        const aging = {
            current: 0,
            "1_30_days": 0,
            "31_60_days": 0,
            "61_90_days": 0,
            "over_90_days": 0
        };

        invoices.forEach(invoice => {
            const dueDate = new Date(invoice.due_date);
            const daysPastDue = Math.floor((asOfDate - dueDate) / (1000 * 60 * 60 * 24));

            const balance = invoice.total_amount - (invoice.paid_amount || 0);

            if (balance <= 0) return;

            totalOutstanding += balance;

            if (daysPastDue <= 0) {
                aging.current += balance;
            } else if (daysPastDue <= 30) {
                aging["1_30_days"] += balance;
            } else if (daysPastDue <= 60) {
                aging["31_60_days"] += balance;
            } else if (daysPastDue <= 90) {
                aging["61_90_days"] += balance;
            } else {
                aging["over_90_days"] += balance;
            }
        });

        const response = {
            vendor_id: id,
            vendor_number: vendor.Vendor_number,
            vendor_name: vendor.name,
            tax_id: vendor.tax_id,
            total_outstanding: Math.round(totalOutstanding * 100) / 100,
            aging_summary: aging,
            as_of_date: asOfDate.toISOString().split('T')[0],
            total_invoices: invoices.length,
            active_invoices_count: invoices.length
        };

        res.status(200).json(response);

    } catch (error) {
        console.error("Error in getVendorAgingSummary:", error);
        res.status(500).json({
            msg: "Server Error",
            error: error.message
        });
    }
};

const getAPSummaryByDate = async (req, res) => {
    try {
        const { from_date, to_date } = req.query;

        if (!from_date || !to_date) {
            return res.status(400).json({
                msg: "from_date and to_date are required"
            });
        }

        const from = new Date(from_date);
        const to = new Date(to_date);

        if (isNaN(new Date(from_date).getTime()) || isNaN(new Date(to_date).getTime())) {
            return res.status(400).json({
                msg: "Invalid date format. Use YYYY-MM-DD"
            });
        }

        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);

        const invoices = await Ap_invoices.find({
            invoice_date: {
                $gte: from_date,
                $lte: to_date      
            }
        }).populate('vendor_id', 'name');

        let totalInvoices = 0;
        let totalInvoicesAmount = 0;
        let totalPaid = 0;
        let totalOutstanding = 0;

        const invoiceDetails = invoices.map(invoice => {
            const paid = invoice.paid_amount || 0;
            const outstanding = (invoice.total_amount || 0) - paid;

            totalInvoices++;
            totalInvoicesAmount += invoice.total_amount || 0;
            totalPaid += paid;
            totalOutstanding += outstanding;

            return {
                invoice_id: invoice._id,
                invoice_number: invoice.invoice_number,
                vendor: {
                    id: invoice.vendor_id?._id,
                    vendor_number: invoice.vendor_id?.Vendor_number,
                    name: invoice.vendor_id?.name
                },
                invoice_date: invoice.invoice_date,
                due_date: invoice.due_date,
                total_amount: invoice.total_amount,
                paid_amount: paid,
                outstanding_amount: outstanding,
                status: invoice.status
            };
        });

        return res.status(200).json({
            period: {
                from: from_date,
                to: to_date
            },
            summary: {
                total_invoices: totalInvoices,
                total_invoices_amount: Number(totalInvoicesAmount.toFixed(2)),
                total_paid: Number(totalPaid.toFixed(2)),
                total_outstanding: Number(totalOutstanding.toFixed(2))
            },
            invoices: invoiceDetails
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Server Error",
            error: error.message
        });
    }
};

module.exports = { addAp_invoices, getallAp_invoices, getJAPById, getJAPByStatus, getVendorAgingSummary, updatestatus, getAPSummaryByDate, getAp_invoicesById };