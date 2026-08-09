const GlAccount = require("../Models/GlAccounts");
const mongoose = require("mongoose")
const {glSchema} = require("../Controllers/Validation/glValidation")

const addGlAccount = async (req, res) => {
    try {
        const {error, value} = glSchema.validate(req.body, {abortEarly: false, stripUnknown: true})

        const {name, type, subtype, is_control, normal_balance} = value

        if(error) return res.status(400).json({msg: error.details.map(err => err.message)})

        const existaccount = await GlAccount.findOne({name})

        if(existaccount) return res.status(400).json({msg: "Account Already Exist"})

        const account = await GlAccount.create({name, type, subtype, is_control, normal_balance})

        res.status(201).json({msg: "Account Created Successfully", data: account})

    } catch (error) {
        res.status(500).json({msg: "Server Error", error: error.message});
    }
}

const getallaccounts = async (req, res) => {
   try {

    const account = await GlAccount.find();
        
    res.status(200).json({msg:"All Accounts Retrived", account})
        
   } catch (error) {
        res.status(500).json({msg: "Server Error",error: error.message}) 
   }
}

const updateAccount = async (req, res) => {
  try {

    const {error, value} = glSchema.validate(req.body, {abortEarly: false, stripUnknown: true})

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

    const updatedItem = await GlAccount.findByIdAndUpdate(id,updateData,{new: true});

    if (!updatedItem) {
      return res.status(404).json({ msg: "Account not found" });
    }

    res.status(200).json({msg: "Account updated successfully",updatedItem});

  } catch (error) {
    res.status(500).json({msg: "Server Error",error: error.message});
  }
};

const deleteaccount = async (req,res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ msg: "ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid Data" });
    }

    const deletedItem = await GlAccount.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ msg: "Account not found" });
    }

    res.status(200).json({
      message: "Account deleted successfully", deletedItem});

  } catch (error) {
    res.status(500).json({msg: "Server Error", error: error.message});
  }
}

const updatestatus = async (req, res) => {
    try {

        const { id } = req.params;
        const { is_control } = req.body;

        if (!id) {
            return res.status(400).json({ msg: "Account ID is required" });
        }

        const glAccount = await GlAccount.findByIdAndUpdate(id, { is_control }, { new: true });

        if (!glAccount) {
            return res.status(404).json({ msg: "Account not found" });
        }

        res.status(200).json({ msg: "Status Updated successfully", GlAccount: glAccount });

    } catch (error) {
        res.status(500).json({ msg: "Server Error", error: error.message })
    }
}

module.exports = {addGlAccount, getallaccounts, updateAccount, deleteaccount, updatestatus};