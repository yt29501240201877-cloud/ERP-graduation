const Accounting_Periods = require("../Models/Accounting_Periods")
const mongoose = require("mongoose")
const {acc_perShema} = require("../Controllers/Validation/acc_perValidation")

const addaccperiod = async (req, res) => {
    try {
        const {error, value} = acc_perShema.validate(req.body, {abortEarly: false, stripUnknown: true})

        const {name, start_date, end_date, closed_at, status, closed_by} = value

        if(error) return res.status(400).json({msg: error.details.map(err => err.message)})

        const existaccount = await Accounting_Periods.findOne({start_date, end_date})

        if(existaccount) return res.status(400).json({msg: "Account Period Already Exist"})

        const account = await Accounting_Periods.create({name, start_date, end_date, closed_at, status, closed_by})

        res.status(201).json({msg: "Account Period Created Successfully", data: account})

    } catch (error) {
        res.status(500).json({msg: "Server Error", error: error.message});
    }
}

const getallaccperiods = async (req, res) => {
   try {

    const account = await Accounting_Periods.find().populate('closed_by');
        
    res.status(200).json({msg:"All Accounts Period Retrived", account})
        
   } catch (error) {
        res.status(500).json({msg: "Server Error",error: error.message}) 
   }
}

const updatestatus = async (req,res) => {
    try {

      const { id } = req.params;
      const { status } = req.body;

      if (!id) {
       return res.status(400).json({ msg: "Account Period ID is required" });
      }

      const user = await Accounting_Periods.findByIdAndUpdate(id,{ status },{new: true});

      if (!user) {
       return res.status(404).json({ msg: "Account Period not found" });
      }

      res.status(200).json({msg: "Status Updated successfully", Users: user});

    } catch (error) {
        res.status(500).json({msg: "Server Error",error: error.message}) 
    }
}

const deleteaccount = async (req,res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ msg: "ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid Data" });
    }

    const deletedItem = await Accounting_Periods.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ msg: "Account Period not found" });
    }

    res.status(200).json({
      message: "Account Period deleted successfully", deletedItem});

  } catch (error) {
    res.status(500).json({msg: "Server Error", error: error.message});
  }
} 

module.exports = {addaccperiod, getallaccperiods, updatestatus, deleteaccount};