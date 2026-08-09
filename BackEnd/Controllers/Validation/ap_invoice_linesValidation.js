const Joi = require("joi");
const { model } = require("mongoose");

const ap_linesShema = Joi.object({
    description: Joi.string().required(),
    quantity: Joi.number().required(),
    unit_price: Joi.number().required(),
    invoice_id: Joi.string().required(),
    account_id: Joi.string().required(),
    // tax_rate_id: Joi.string()
})

module.exports = {ap_linesShema};