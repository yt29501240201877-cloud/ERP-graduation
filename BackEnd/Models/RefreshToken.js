const mongoose = require("mongoose");
const bcrypt = require("bcrypt");    
const Users = require("./Users");
    
const tokenSchema = new mongoose.Schema({
    token_hash: {
        type: String,
        required: true,
    },
    expires_at: {
        type: Date,
        required: true,
    },
    revoked_at: {
        type: Boolean,
        default: false, 
    },
    Users:[{
        type:mongoose.Schema.ObjectId,
        ref:'Users',
    }]
}, {timestamps: true});

const RefreshToken = mongoose.model("RefreshToken", tokenSchema);

module.exports = RefreshToken;