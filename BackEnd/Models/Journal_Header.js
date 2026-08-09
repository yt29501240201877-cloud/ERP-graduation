const mongoose = require("mongoose")
const Counter = require("./Counter")

const journal_hShema = new mongoose.Schema({
    journal_number: {
        type: String,
        unique: true
    },
    date: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    source: {
        type: String,
        enum: ["MANUAL", "AP", "AR", "ASSET", "PAYROLL", "SYSTEM"],
        required: true
    },
    status: {
        type: String,
        enum: ["DRAFT", "POSTED", "REVERSED"],
        required: true 
    },
    period: {
        type:mongoose.Schema.ObjectId,
        ref:'Accounting_Periods',
        required: true
    }
});

journal_hShema.pre("save", async function () {
  try {
    if (!this.isNew) return ;

    const counter = await Counter.findOneAndUpdate(
      { name: "Journal Header" },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );
    this.journal_number = `JN-${counter.value.toString().padStart(3, "0")}`;

  } catch (err) {
    throw err;
  }
});

const Journal_Header = mongoose.model("Journal_Header", journal_hShema);

module.exports = Journal_Header;
