const mongoose = require("mongoose")
const Counter = require("./Counter")

const customerSchema = new mongoose.Schema({
    customer_number: {
        type: String,
        unique: true
    },
    name:{
        type: String,
        required: true
    },
    payment_terms: {
        type: String,
        required: true,
        enum: ["NET30", "NET60", "IMMEDIATE"]
    },
    credit_limit: {
        type: Number,
    },
    tax_id: {
        type: String,
        required: true,
        unique: true
    },
    status:{
        type: String,
        required: true,
        enum: ["ACTIVE", "INACTIVE", "BLOCKED"]
    }
});

customerSchema.pre("save", async function () {
    try {
        if (!this.isNew) return;

        const counter = await Counter.findOneAndUpdate(
            { name: "Customers" },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        );
        this.customer_number = `CUS-${counter.value.toString().padStart(3, "0")}`;

    } catch (err) {
        throw err;
    }
});

const Customers = mongoose.model("Customers", customerSchema);

module.exports = Customers;