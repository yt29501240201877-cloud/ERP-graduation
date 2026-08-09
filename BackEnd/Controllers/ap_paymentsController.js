const Ap_payments = require("../Models/Ap_payments")
const mongoose = require("mongoose")
const { ap_paymentsShema } = require("../Controllers/Validation/ap_paymentsValidation")

const addAp_payments = async (req, res) => {
    try {
        const { error, value } = ap_paymentsShema.validate(req.body, { abortEarly: false, stripUnknown: true })

        const { payment_date, payment_method, total_amount, status, bank_reference, journal_id } = value

        if (error) return res.status(400).json({ msg: error.details.map(err => err.message) })

        const payment = await Ap_payments.create({ payment_date, payment_method, total_amount, status, bank_reference, journal_id })

        res.status(201).json({ msg: "Journal Header Created Successfully", data: payment })

    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
}

const getallpayments= async (req, res) => {
   try {

    const Journal = await Ap_payments.find();

    res.status(200).json({msg:"All Accounts Payable Payments Retrived", Journal})

   } catch (error) {
        res.status(500).json({msg: "Server Error",error: error.message}) 
   }
}

const updatestatus = async (req,res) => {
    try {

      const { id } = req.params;
      const { status } = req.body;

      if (!id) {
       return res.status(400).json({ msg: "Account Payable Payment ID is required" });
      }

      const payment = await Ap_payments.findByIdAndUpdate(id,{ status },{new: true});

      if (!payment) {
       return res.status(404).json({ msg: "Account Payable Payment not found" });
      }

      res.status(200).json({msg: "Status Updated successfully", ap_payment: payment});

    } catch (error) {
        res.status(500).json({msg: "Server Error",error: error.message}) 
    }
}

module.exports = { addAp_payments, getallpayments, updatestatus };