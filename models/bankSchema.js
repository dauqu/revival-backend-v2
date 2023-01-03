// beneficiary schema 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bankSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    account_holder: {
        type: String,
        required: true,
    },
    account_no:{
        type:  String,
        required: true,
    },
    bank_name: {
        type: String,
        required: true,
    },
    branch_name: {
        type: String,
        required: true,
    },
    bank_code: {
        type: String,
        required: true,
    },
    swift_code: {
        type: String,
        required: true,
    },
    bank_type:{
        type:  String,
        required: true,
    },
    recieve_address: {
        type:  String,
        required: true,
    }

}, {
    timestamps: true
});

const Bank = mongoose.model('Bank', bankSchema);
module.exports = Bank;