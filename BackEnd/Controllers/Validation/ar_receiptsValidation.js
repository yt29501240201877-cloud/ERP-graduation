const Joi = require("joi");
const { model } = require("mongoose");

const ar_receiptsShema = Joi.object({
    receipt_date: Joi.string().required(),
    amount: Joi.number().required(),
    unapplied_amount: Joi.number().required(),
    payment_method: Joi.string().valid("BANK", "CASH", "CARD", "ONLINE").required(),
    customer_id: Joi.string().required(),
    ar_invoices_id: Joi.string().required(),
    journal_id: Joi.string()
})

module.exports = {ar_receiptsShema};