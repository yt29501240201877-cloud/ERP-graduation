const Journal_lines = require("../Models/Journal_lines")
const GlAccount = require("../Models/GlAccounts")
const Journal_Header = require("../Models/Journal_Header")
const mongoose = require("mongoose")
const {journal_lShema} = require("../Controllers/Validation/journal_linesValidation")

const addjourline = async (req, res) => {
    try {
        const {error, value} = journal_lShema.validate(req.body, {abortEarly: false, stripUnknown: true})

        const {debit_amount, credit_amount, description, journal_id, glaccount_id} = value

        const existjournalH = await Journal_Header.findById(journal_id)
        
        if(!existjournalH) return res.status(400).json({msg: "Journal Header Isn't Exist"})

        const existglaccount = await GlAccount.findById(glaccount_id)
        
        if(!existglaccount) return res.status(400).json({msg: "GL Account Isn't Exist"})    

        const journal_line = await Journal_lines.create({debit_amount, credit_amount, description, journal_id, glaccount_id})

        res.status(201).json({msg: "Journal Line Created Successfully", data: journal_line})

    } catch (error) {
        res.status(500).json({msg: "Server Error", error: error.message});
    }
}

const getalljourl= async (req, res) => {
   try {

    const Journal = await Journal_lines.find();
        
    res.status(200).json({msg:"All Journal lines Retrived", Journal})
        
   } catch (error) {
        res.status(500).json({msg: "Server Error",error: error.message}) 
   }
}

const getJlById = async (req, res) => {
    try {

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ msg: "ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid ID" });
    }

    const data = await Journal_lines.findById(id);

    if (!data) {
      return res.status(404).json({ msg: "Journal Line not found" });
    }

    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
}

const updateJL = async (req, res) => {
  try {

    const {error, value} = journal_lShema.validate(req.body, {abortEarly: false, stripUnknown: true})

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

    const updatedItem = await Journal_lines.findByIdAndUpdate(id,updateData,{new: true});

    if (!updatedItem) {
      return res.status(404).json({ msg: "Journal Lines not found" });
    }

    res.status(200).json({msg: "Journal Lines updated successfully",updatedItem});

  } catch (error) {
    res.status(500).json({msg: "Server Error",error: error.message});
  }
};


const deleteJL = async (req,res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ msg: "ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid Data" });
    }

    const deletedItem = await Journal_lines.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ msg: "Journal Line not found" });
    }

    res.status(200).json({
      message: "Journal Line deleted successfully", deletedItem});

  } catch (error) {
    res.status(500).json({msg: "Server Error", error: error.message});
  }
} 

module.exports = {addjourline, getalljourl, getJlById, updateJL, deleteJL};