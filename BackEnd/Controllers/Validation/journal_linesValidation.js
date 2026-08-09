const Joi = require("joi");
const { model } = require("mongoose");

const journal_lShema = Joi.object({
    debit_amount: Joi.string().required(),
    credit_amount: Joi.string().required(),
    description: Joi.string(),
    journal_id: Joi.string().required(),
    glaccount_id: Joi.string(),
})

module.exports = {journal_lShema};