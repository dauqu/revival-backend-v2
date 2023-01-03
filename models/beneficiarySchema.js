// beneficiary schema 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var beneficiarySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
    },
    identification_no: {
        type: String,
        required: true,
    },
    relationship: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    contact:{
        type:  String,
        required: true,
    }
}, {
    timestamps: true
});

const Beneficiary = mongoose.model('beneficiary', beneficiarySchema);
module.exports = Beneficiary;