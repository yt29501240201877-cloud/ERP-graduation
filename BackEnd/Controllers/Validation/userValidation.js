const Joi = require("joi");

const loginSchema = Joi.object({
    email: Joi.string().trim().required().email(),
    password: Joi.string().min(8).required(),
});

const registerSchema = Joi.object({
    email: Joi.string().email().required().trim(),
    password: Joi.string().trim().required().min(6),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    role: Joi.string().valid("Admin","Accountant","Procurment Manager", "Sales Manger", "Financial Manger"),
    is_active: Joi.string().valid("Active", "Inactive", "Suspended"),
})

module.exports = {loginSchema, registerSchema};