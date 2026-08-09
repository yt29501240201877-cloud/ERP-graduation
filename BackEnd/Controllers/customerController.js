const Customers = require("../Models/Customers")
const mongoose = require("mongoose")
const { customerSchema } = require("../Controllers/Validation/customerValidation")

const addcustomer = async (req, res) => {
    try {
        const { error, value } = customerSchema.validate(req.body, { abortEarly: false, stripUnknown: true })

        const { name, tax_id, payment_terms, credit_limit, status } = value

        if (error) return res.status(400).json({ msg: error.details.map(err => err.message) })

        const existcustomer = await Customers.findOne({ tax_id })

        if (existcustomer) return res.status(400).json({ msg: "Customer Already Exist" })

        const Customer = await Customers.create({ name, tax_id, payment_terms, credit_limit, status })

        res.status(201).json({ msg: "Customer Created Successfully", data: Customer })

    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
}

const getallCustomer = async (req, res) => {
    try {

        const Customer = await Customers.find();

        res.status(200).json({ msg: "All Vendors Retrived", Customer })

    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message })
    }
}

const getCustomerById = async (req, res) => {
    try {

        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ msg: "ID is required" });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: "Invalid ID" });
        }

        const data = await Customers.findById(id);

        if (!data) {
            return res.status(404).json({ msg: "Customer not found" });
        }

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
}

const updateCustomer = async (req, res) => {
    try {

        const { error, value } = customerSchema.validate(req.body, { abortEarly: false, stripUnknown: true })

        const { id } = req.params;
        const updateData = req.body;

        if (!id) {
            return res.status(400).json({ msg: "ID is required" });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: "Invalid Data" });
        }

        if (!Object.keys(updateData).length) {
            return res.status(400).json({ msg: "No data provided for update" });
        }

        const updatedItem = await Customers.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedItem) {
            return res.status(404).json({ msg: "Customer not found" });
        }

        res.status(200).json({ msg: "Customer updated successfully", updatedItem });

    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};

const updatestatus = async (req, res) => {
    try {

        const { id } = req.params;
        const { status } = req.body;

        if (!id) {
            return res.status(400).json({ msg: "Customer ID is required" });
        }

        const Customer = await Customers.findByIdAndUpdate(id, { status }, { new: true });

        if (!Customer) {
            return res.status(404).json({ msg: "Customer not found" });
        }

        res.status(200).json({ msg: "Status Updated successfully", Customer: Customer });

    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message })
    }
}


module.exports = { addcustomer, getallCustomer, getCustomerById, updateCustomer, updatestatus};