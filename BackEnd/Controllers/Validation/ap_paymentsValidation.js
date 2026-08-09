const Joi = require("joi");
const { model } = require("mongoose");

const ap_paymentsShema = Joi.object({
    payment_date: Joi.string().required(),
    total_amount: Joi.number().required(),
    payment_method: Joi.string().required().valid("BANK_TRANSFER", "CHECK", "ONLINE"),
    status: Joi.string().valid("DRAFT", "PROCESSING", "COMPLETED", "FAILED").required(),
    bank_reference: Joi.string(),
    journal_id: Joi.string().required()
})

module.exports = {ap_paymentsShema};