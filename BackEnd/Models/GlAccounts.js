const mongoose = require("mongoose");
const Counter = require("./Counter")

const glSchema = new mongoose.Schema({
    Account_number: {
        type: String,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["ASSET", "LIABILITY", "EQUITY", "REVENUE", "EXPENSE"],
        required: true,
    },
    subtype: {
        type: String,
        enum: ["current_asset", "long_term_liability"],
        required: true,
    },
    is_control: {
        type: String,
        enum: ["ACTIVE", "LOCKED"],
        default: "ACTIVE"
    },
    normal_balance: {
        type: String,
        enum: ["DEBIT", "CREDIT"],
        required: true,
    }
}, { timestamps: true });

glSchema.pre("save", async function () {
    try {
        if (!this.isNew) return;

        const counter = await Counter.findOneAndUpdate(
            { name: "GlAccounts" },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        );
        this.Account_number = `ACC-${counter.value.toString().padStart(3, "0")}`;

    } catch (err) {
        throw err;
    }
});

const GlAccounts = mongoose.model("GlAccount", glSchema);

module.exports = GlAccounts;