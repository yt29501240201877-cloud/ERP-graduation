const axios = require("axios");

const trainAI = async (req, res) => {

    try {

        const { from_date, to_date } = req.body;

        const invoices = await Ap_invoices
            .find({
                invoice_date: {
                    $gte: from_date,
                    $lte: to_date
                }
            })
            .populate("vendor_id", "name");

        const payload = invoices.map(inv => ({
            invoice_date: inv.invoice_date,
            due_date: inv.due_date,
            total_amount: inv.total_amount,
            paid_amount: inv.paid_amount,
            vendor: {
                id: inv.vendor_id._id,
                name: inv.vendor_id.name
            }
        }));

        const ai = await axios.post(
            "http://localhost:8000/train",
            {
                invoices: payload
            }
        );

        res.json(ai.data);

    } catch (err) {

        res.status(500).json({
            msg: err.message
        });

    }

};

module.exports = { trainAI };