// statement models 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var statementSchema = new Schema({
    user: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User"
    },
    amount: {
        type: Number,
        required: true
    },
    earned_amount: {
        type: Number,
        required: true
    },
    percentage_earned: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

var Statements = mongoose.model('Statement', statementSchema);
module.exports = Statements;