const Users = require("../Models/Users")
const mongoose = require("mongoose")
const dayjs = require("dayjs");
const {registerSchema} = require("../Controllers/Validation/userValidation")

const getallusers = async (req, res) => {
   try {

    const user = await Users.find();

    const formattedUsers = user.map((user) => ({
      ...user.toObject(),
      last_login: user.last_login
        ? dayjs(user.last_login).format("DD-MM-YY HH:mm")
        : null,

      image: user.image ? user.image.startsWith("Uploads")
          ? user.image.replace(/\\/g, "/") : `Uploads/${user.image}` : null 
    }));
        
    res.status(200).json({msg:"All Users Retrived", user: formattedUsers})
        
   } catch (error) {
      res.status(500).json({msg: "Server Error",error: error.message}) 
   }
}

const updaterole = async (req,res) => {
    try {

      const { id } = req.params;
      const { role } = req.body;

      if (!id) {
       return res.status(400).json({ msg: "User ID is required" });
      }

      const user = await Users.findByIdAndUpdate(id,{ role },{new: true});

      if (!user) {
       return res.status(404).json({ msg: "User not found" });
      }

      res.status(200).json({msg: "Role Updated successfully", Users: user});

    } catch (error) {
        res.status(500).json({msg: "Server Error",error: error.message}) 
    }
}

const updateUser = async (req, res) => {
  try {

    const {error, value} = registerSchema.validate(req.body, {abortEarly: false, stripUnknown: true})

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

    const updatedItem = await Users.findByIdAndUpdate(id,updateData,{new: true});

    if (!updatedItem) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({msg: "User updated successfully",updatedItem});

  } catch (error) {
    res.status(500).json({msg: "Server Error",error: error.message});
  }
};

const deleteUser = async (req,res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ msg: "ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid Data" });
    }

    const deletedItem = await Users.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({
      message: "User deleted successfully", deletedItem});

  } catch (error) {
    res.status(500).json({msg: "Server Error", error: error.message});
  }
}

module.exports = {getallusers, updaterole, updateUser, deleteUser};