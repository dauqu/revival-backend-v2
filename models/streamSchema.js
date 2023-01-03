// income stream schema 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var streamSchema = new Schema({
    user: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User"
    },
    refer: [{
        type: String,
        required: true
    }],
    income: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

var IncomeStreams = mongoose.model('Stream', streamSchema);
module.exports = IncomeStreams;