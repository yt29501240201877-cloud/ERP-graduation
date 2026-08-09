const Joi = require("joi");
const { model } = require("mongoose");

const ap_invoicesShema = Joi.object({
    invoice_date: Joi.string().required(),
    due_date: Joi.string().required(),
    subtotal: Joi.number().required(),
    tax_amount: Joi.number().required(),
    total_amount: Joi.number().required(),
    paid_amount: Joi.number().required(),
    vendor_id: Joi.string().required(),
    journal_id: Joi.string(),
    status: Joi.string().valid("DRAFT", "PENDING", "APPROVED", "PAID", "CANCELLED").required(),
    period_id: Joi.string().required()
})

module.exports = {ap_invoicesShema};