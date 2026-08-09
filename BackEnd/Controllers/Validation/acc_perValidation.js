const Joi = require("joi");
const { model } = require("mongoose");

const acc_perShema = Joi.object({
    name: Joi.string().required(),
    start_date: Joi.string().required(),
    end_date: Joi.string().required(),
    closed_at: Joi.string().required(),
    status: Joi.string().valid("OPEN", "CLOSED", "LOCKED").required(),
    closed_by: Joi.string().required()
})

module.exports = {acc_perShema};