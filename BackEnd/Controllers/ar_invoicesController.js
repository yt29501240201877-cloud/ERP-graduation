const Ar_invoices = require("../Models/Ar_invoices")
const Customers = require('../Models/Customers');
const mongoose = require("mongoose")
const { ar_invoicesShema } = require("../Controllers/Validation/ar_invoicesValidation")

const addAr_invoices = async (req, res) => {
    try {
        const { error, value } = ar_invoicesShema.validate(req.body, { abortEarly: false, stripUnknown: true })

        const { invoice_number, invoice_date, due_date, subtotal, status, tax_amount, total_amount, paid_amount, customer_id, journal_id, period_id } = value

        if (error) return res.status(400).json({ msg: error.details.map(err => err.message) })

        const ar_invoices = await Ar_invoices.findOne({ invoice_number })

        if (ar_invoices) return res.status(400).json({ msg: "Accounts Receivable Invoice Already Exist" })

        const invoices = await Ar_invoices.create({ invoice_date, due_date, subtotal, status, tax_amount, total_amount, paid_amount, customer_id, journal_id, period_id })

        res.status(201).json({ msg: "Accounts Receivable Invoice Created Successfully", data: invoices })

    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
}

const getallAr_invoices = async (req, res) => {
    try {

        const ar_invoices = await Ar_invoices.find().populate('customer_id');

        res.status(200).json({ msg: "All Accounts Receivable Invoice Retrived", ar_invoices })

    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message })
    }
}

const getJARById = async (req, res) => {
    try {

        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ msg: "ID is required" });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: "Invalid ID" });
        }

        const data = await Ar_invoices.findById(id);

        if (!data) {
            return res.status(404).json({ msg: "Account Receivable Invoice not found" });
        }

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
}

const getJARByStatus = async (req, res) => {
    try {

        const { status } = req.params;

        if (!status) {
            return res.status(400).json({ msg: "Status is required" });
        }

        const data = await Ar_invoices.find({ status: status });

        if (!data) {
            return res.status(404).json({ msg: "Account Receivable Invoice not found", data });
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
            return res.status(400).json({ msg: "Account Receivable Invoice ID is required" });
        }

        const ar_invoices = await Ar_invoices.findByIdAndUpdate(id, { status }, { new: true });

        if (!ar_invoices) {
            return res.status(404).json({ msg: "Account Receivable Invoice not found" });
        }

        res.status(200).json({ msg: "Status Updated successfully", Ar_invoices: ar_invoices });

    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message })
    }
}

const deleteAR = async (req,res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ msg: "ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid Data" });
    }

    const deletedItem = await Ar_invoices.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ msg: "Account Recievavle Invoice not found" });
    }

    res.status(200).json({
      message: "Account Recievavle Invoice deleted successfully", deletedItem});

  } catch (error) {
    res.status(500).json({msg: "Server Error", error: error.message});
  }
}

const getCustomerAging = async (req, res) => {
    try {
        const { id } = req.params;

        const customer = await Customers.findById(id);
        if (!customer) {
            return res.status(404).json({ msg: "Customer not found" });
        }

        const invoices = await Ar_invoices.find({
            customer_id: id,
            status: { $in: ["APPROVED", "PENDING", "PAID"] }
        });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let current = 0;  
        let days_31_60 = 0;
        let days_61_90 = 0;
        let days_over_90 = 0;
        let total_outstanding = 0;

        const details = invoices.map(inv => {
            const paid = inv.paid_amount || 0;
            const outstanding = (inv.total_amount || 0) - paid;

            if (outstanding <= 0) return null;

            const dueDate = new Date(inv.due_date);
            const diffTime = today - dueDate;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            let bucket = "current";

            if (diffDays <= 0) {
                current += outstanding;
                bucket = "current";
            } else if (diffDays <= 30) {
                current += outstanding;
                bucket = "1-30";
            } else if (diffDays <= 60) {
                days_31_60 += outstanding;
                bucket = "31-60";
            } else if (diffDays <= 90) {
                days_61_90 += outstanding;
                bucket = "61-90";
            } else {
                days_over_90 += outstanding;
                bucket = "90+";
            }

            total_outstanding += outstanding;

            return {
                invoice_id: inv._id,
                invoice_number: inv.invoice_number,
                invoice_date: inv.invoice_date,
                due_date: inv.due_date,
                total_amount: inv.total_amount,
                paid_amount: paid,
                outstanding: Number(outstanding.toFixed(2)),
                days_overdue: diffDays > 0 ? diffDays : 0,
                aging_bucket: bucket
            };
        }).filter(Boolean);

        return res.status(200).json({
            customer: {
                id: customer._id,
                name: customer.name,
            },
            aging_summary: {
                current: Number(current.toFixed(2)),
                "31_60": Number(days_31_60.toFixed(2)),
                "61_90": Number(days_61_90.toFixed(2)),
                over_90: Number(days_over_90.toFixed(2)),
                total_outstanding: Number(total_outstanding.toFixed(2))
            },
            invoices: details
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: "Server Error",
            error: error.message
        });
    }
};

const getARSummaryByDate = async (req, res) => {
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

        const invoices = await Ar_invoices.find({
            invoice_date: {
                $gte: from_date,
                $lte: to_date      
            }
        }).populate('customer_id', 'name');

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
                customer: {
                    id: invoice.customer_id?._id,
                    customer_number: invoice.customer_id?.customer_number,
                    name: invoice.customer_id?.name
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

module.exports = { addAr_invoices, getallAr_invoices, getJARById, getJARByStatus, getCustomerAging, updatestatus, deleteAR, getARSummaryByDate };