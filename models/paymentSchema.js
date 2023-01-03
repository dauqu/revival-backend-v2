// payment model 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var paymentSchema = new Schema({
    level: {
        type: Number,
        required: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User"
    },
    amount: {
        type: Number,
        required: true
    },
    bank_name: {
        type: String,
        required: true  
    },
    account_number: {
        type: String,
        required: true  
    },
    status: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

var Payments = mongoose.model('Payment', paymentSchema);
module.exports = Payments;