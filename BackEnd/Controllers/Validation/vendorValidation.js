const Joi = require("joi");
const { model } = require("mongoose");

const vendorSchema = Joi.object({
    name: Joi.string().required(),
    tax_id: Joi.string().required(),
    payment_terms: Joi.string().valid("NET30", "NET60", "IMMEDIATE").required(),
    credit_limit: Joi.number(),
    status: Joi.string().valid("ACTIVE", "INACTIVE", "BLOCKED").required()
})

module.exports = {vendorSchema};