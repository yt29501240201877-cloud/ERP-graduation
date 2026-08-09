const Joi = require("joi");
const { model } = require("mongoose");

const journal_hShema = Joi.object({
    date: Joi.string().required(),
    description: Joi.string().required(),
    source: Joi.string().required().valid("MANUAL", "AP", "AR", "ASSET", "PAYROLL", "SYSTEM"),
    status: Joi.string().valid("DRAFT", "POSTED", "REVERSED").required(),
    period: Joi.string().required()
})

module.exports = {journal_hShema};