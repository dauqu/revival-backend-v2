const router = require("express").Router();
const Payment = require("../models/paymentSchema");
const User = require("../models/userSchema");
const jwt=require("jsonwebtoken");

router.get("/", async (req, res) => {
    const token = req.cookies.token || req.headers['token'] || req.body.token;
    try {
        if(!token || token === "" || token === null || token === undefined) {
            return res.status(200).json({message: "Please request with token", status: "warning"})
        }
        const verfied = jwt.verify(token, process.env.JWT_SECRET);
        if(!verfied) {
            return res.status(200).json({message: "Anauthorized", status: "warning"})
        }
        
        const allPayments = await Payment.find({user: verfied.id});
        const userdetails = await User.findById(verfied.id);

        return res.status(200).json({payments: allPayments, user: userdetails, status: "success", message: "Payments found"});
    } catch (error) {
        return res.status(200).json({status: "success", message: error});
    }
})

// create new payment 
router.post("/", async (req, res) => {
    const {level, user, amount, account_number, status, bank_name} = req.body;

    const newPayment = new Payment({
        level,
        user,
        amount,
        account_number,
        status,
        bank_name
    });
    
    try {
        const savedPayment = await newPayment.save();
        return res.status(200).json({payment: savedPayment, status: "success", message: "Payment created"});
    } catch (error) {
        return res.status(200).json({message: "Error creating payment", status: "warning"})
    }
})


module.exports = router;