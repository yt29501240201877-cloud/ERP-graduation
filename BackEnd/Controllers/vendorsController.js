const Vendors = require("../Models/Vendors")
const mongoose = require("mongoose")
const { vendorSchema } = require("../Controllers/Validation/vendorValidation")

const addvendor = async (req, res) => {
    try {
        const { error, value } = vendorSchema.validate(req.body, { abortEarly: false, stripUnknown: true })

        const { name, tax_id, payment_terms, credit_limit, status } = value

        if (error) return res.status(400).json({ msg: error.details.map(err => err.message) })

        const existvendor = await Vendors.findOne({ tax_id })

        if (existvendor) return res.status(400).json({ msg: "Vendor Already Exist" })

        const vendor = await Vendors.create({ name, tax_id, payment_terms, credit_limit, status })

        res.status(201).json({ msg: "Vendor Created Successfully", data: vendor })

    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
}

const getallvendor = async (req, res) => {
    try {

        const vendor = await Vendors.find();

        res.status(200).json({ msg: "All Vendors Retrived", vendor })

    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message })
    }
}

const getvendorById = async (req, res) => {
    try {

        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ msg: "ID is required" });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ msg: "Invalid ID" });
        }

        const data = await Vendors.findById(id);

        if (!data) {
            return res.status(404).json({ msg: "Vendors not found" });
        }

        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
}

const updateVendor = async (req, res) => {
    try {

        const { error, value } = vendorSchema.validate(req.body, { abortEarly: false, stripUnknown: true })

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

        const updatedItem = await Vendors.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedItem) {
            return res.status(404).json({ msg: "Vendor not found" });
        }

        res.status(200).json({ msg: "Vendor updated successfully", updatedItem });

    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
};

const updatestatus = async (req, res) => {
    try {

        const { id } = req.params;
        const { status } = req.body;

        if (!id) {
            return res.status(400).json({ msg: "Vendor ID is required" });
        }

        const vendor = await Vendors.findByIdAndUpdate(id, { status }, { new: true });

        if (!vendor) {
            return res.status(404).json({ msg: "Vendor not found" });
        }

        res.status(200).json({ msg: "Status Updated successfully", Vendor: vendor });

    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message })
    }
}


module.exports = { addvendor, getallvendor, getvendorById, updateVendor, updatestatus};