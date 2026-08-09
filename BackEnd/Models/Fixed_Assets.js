const mongoose = require("mongoose")
const Counter = require("./Counter");
const { required, number } = require("joi");

const assetsShema = new mongoose.Schema({
    asset_number: {
        type: String,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    acquisition_date: {
        type: String,
        required: true
    },
    acquisition_cost: {
        type: Number,
        required: true
    },
    residual_value: {
        type: Number,
        required: true
    },
    useful_life_months: {
        type: Number,
        required: true
    },
    depreciation_method: {
        type: String,
        enum: ["STRAIGHT_LINE", "DECLINING_BALANCE"],
        required: true
    },
    category: {
        type: String,
        enum: ["BUILDING", "EQUIPMENT", "VEHICLE", "IT", "FURNITURE"],
        required: true
    },
    accumulated_depreciation: {
        type: Number,
        required: true
    },
    net_book_value: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["ACTIVE", "FULLY_DEPRECIATED", "DISPOSED"],
        required: true
    },
});

assetsShema.pre("save", async function () {
  try {
    if (!this.isNew) return ;

    const counter = await Counter.findOneAndUpdate(
      { name: "Fixed Assets" },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );
    this.asset_number = `FAS-${counter.value.toString().padStart(5, "0")}`;

  } catch (err) {
    throw err;
  }
});

const Fixed_Assets = mongoose.model("Fixed_Assets", assetsShema);

module.exports = Fixed_Assets;
