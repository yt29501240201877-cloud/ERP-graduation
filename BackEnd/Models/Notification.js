const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
    type: {
        type: String,
        enum: ["invoice_created", "invoice_approved", "invoice_rejected", "user_login"]
    },
    entityId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    entityType: {
        type: String,
        enum: ["invoice", "user"]
    },
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 100
    },
    message: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 200
    },
    readAt: {
        type: Date
    }
}, {timestamps: true});

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;