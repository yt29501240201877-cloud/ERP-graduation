const mongoose = require("mongoose")
const Counter = require("./Counter")

const vendorSchema = new mongoose.Schema({
    Vendor_number:{
        type: String,
        unique: true
    },
    name:{
        type: String,
        required: true
    },
    tax_id: {
        type: String,
        required: true,
        unique: true
    },
    payment_terms: {
        type: String,
        required: true,
        enum: ["NET30", "NET60", "IMMEDIATE"]
    },
    credit_limit: {
        type: Number,
    },
    status:{
        type: String,
        required: true,
        enum: ["ACTIVE", "INACTIVE", "BLOCKED"]
    }
})

vendorSchema.pre("save", async function () {
  try {
    if (!this.isNew) return ;

    const counter = await Counter.findOneAndUpdate(
      { name: "Vendors" },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );
    this.Vendor_number = `VEN-${counter.value.toString().padStart(3, "0")}`;

  } catch (err) {
    throw err;
  }
});

const Vendors = mongoose.model("Vendors", vendorSchema);

module.exports = Vendors;