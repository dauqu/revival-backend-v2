const mongoose = require('mongoose')

const referelSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
        ref: 'User'
    },
    referal: {
        type: String,
        required: true
    },
    percentage_earned: {
        type: Number,
        required: true
    },
    amount_earned: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: false,
        default: 'referral'
    },
    transaction_type: {
        type: String,
        required: false,
        default: 'credit'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Referal', referelSchema)
