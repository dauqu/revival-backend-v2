const { default: mongoose, Schema, model } = require('mongoose');

const userSchema = new Schema({
    name: {
        type: String,
    },
    username: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    profile: {
        type: String,
        default: "https://placeimg.com/192/192/people",
    },
    country: {
        type: String,
    },
    phone: {
        type: String,
    },
    password: {
        type: String,
    },
    passport: {
        type: String,
    },
    national_id: {
        type: String,
    },
    level: {
        type: Number,
        required: true,
        default: 1
    },
    referred_by: {
        type: String,
        default: null
    },
    total_earning: {
        type: Number,
        default: 0
    },
    total_withdrawal: {
        type: Number,
        default: 0
    },
    total_referral: {
        type: Number,
        default: 0
    },
    total_referral_earning: {
        type: Number,
        default: 0
    },
    total_donation: {
        type: Number,
        default: 0
    },

})

const User = model("User", userSchema);
module.exports = User;