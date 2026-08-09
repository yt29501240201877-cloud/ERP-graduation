const Journal_Header = require("../Models/Journal_Header")
const mongoose = require("mongoose")
const {journal_hShema} = require("../Controllers/Validation/Journal_HeaderValidation")

const addjnh = async (req, res) => {
    try {
        const {error, value} = journal_hShema.validate(req.body, {abortEarly: false, stripUnknown: true})

        const {date, description, source, status, period} = value

        if(error) return res.status(400).json({msg: error.details.map(err => err.message)})

        const existJournal = await Journal_Header.findOne({period})

        if(existJournal) return res.status(400).json({msg: "Journal Header Already Exist"})

        const Journal = await Journal_Header.create({date, description, source, status, period})

        res.status(201).json({msg: "Journal Header Created Successfully", data: Journal})

    } catch (error) {
        res.status(500).json({msg: "Server Error", error: error.message});
    }
}

const getalljnh= async (req, res) => {
   try {

    const Journal = await Journal_Header.find();
        
    res.status(200).json({msg:"All Journal Headers Retrived", Journal})
        
   } catch (error) {
        res.status(500).json({msg: "Server Error",error: error.message}) 
   }
}

const getJhById = async (req, res) => {
    try {

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ msg: "ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid ID" });
    }

    const data = await Journal_Header.findById(id);

    if (!data) {
      return res.status(404).json({ msg: "Journal Header not found" });
    }

    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
}

const updateJH = async (req, res) => {
  try {

    const {error, value} = journal_hShema.validate(req.body, {abortEarly: false, stripUnknown: true})

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

    const updatedItem = await Journal_Header.findByIdAndUpdate(id,updateData,{new: true});

    if (!updatedItem) {
      return res.status(404).json({ msg: "Journal Header not found" });
    }

    res.status(200).json({msg: "Journal Header updated successfully",updatedItem});

  } catch (error) {
    res.status(500).json({msg: "Server Error",error: error.message});
  }
};

const updatestatus = async (req,res) => {
    try {

      const { id } = req.params;
      const { status } = req.body;

      if (!id) {
       return res.status(400).json({ msg: "Journal Header ID is required" });
      }

      const JH = await Journal_Header.findByIdAndUpdate(id,{ status },{new: true});

      if (!JH) {
       return res.status(404).json({ msg: "Journal Header not found" });
      }

      res.status(200).json({msg: "Status Updated successfully", journal: JH});

    } catch (error) {
        res.status(500).json({msg: "Server Error",error: error.message}) 
    }
}


const deleteJH = async (req,res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ msg: "ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid Data" });
    }

    const deletedItem = await Journal_Header.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ msg: "Journal Header not found" });
    }

    res.status(200).json({
      message: "Journal Header deleted successfully", deletedItem});

  } catch (error) {
    res.status(500).json({msg: "Server Error", error: error.message});
  }
} 


module.exports = {addjnh, getalljnh, getJhById, updateJH, updatestatus, deleteJH};