const router = require("express").Router();
const Bank = require("../models/bankSchema");
const jwt = require("jsonwebtoken");


// get all beneficiaries
router.get("/", async (req, res) => {
    // get id from token 
    try {
        const token = req.cookies.token || req.headers['token'] || req.body.token;
        if(token === null || token === undefined || token === ""){
            return res.json({message: "Unauthorized", status: "warning"})
        }
        const verifyUser = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(token);
        // console.log(verifyUser);
        if(!verifyUser){
            return res.json({message: "User not found (Invalid user)", status: "warning"})
        }
        const banks = await Bank.find({user: verifyUser.id }).sort({ createdAt: -1 });
        res.json({banks, message: "Banks details founds", status: "success"})
    } catch (err) {
        res.json({ message: err, status: "error" });
    }
});

// create new Beneficiary 
router.post("/", validateBank, async (req, res) => {
    const {account_holder,account_no, bank_name, recieve_address, branch_name, bank_code, swift_code, bank_type} = req.body;

    try {
        const token = req.cookies.token || req.headers['token'] || req.body.token;
        if(!token || token === null || token === undefined){
            return res.json({message: "Unauthorized", status: "warning"})
        }
        const verifyUser = jwt.verify(token, process.env.JWT_SECRET);
        if(!verifyUser){
            return res.json({message: "User not found (Invalid user)", status: "warning"})
        }

        const new_bank = new Bank({
            user: verifyUser.id,
            account_holder,
            account_no,
            bank_name,
            branch_name,
            bank_code,
            swift_code,
            bank_type,
            recieve_address
        });

        const saved_Bank = await new_bank.save();
        return res.json({ message: "Bank details added", status: "success", bank: saved_Bank});
    } catch (err) {
        return res.json({ message: err });
    }

});

function validateBank(req, res, next) {
    const {account_holder,account_no, bank_name, branch_name, bank_code, swift_code, bank_type, recieve_address} = req.body;

    if (!account_holder || !account_no || !bank_name || !branch_name || !bank_code || !swift_code || !bank_type || !recieve_address || account_holder === "" || account_no === "" || bank_name === "" || branch_name === "" || bank_code === "" || swift_code === "" || bank_type === "" || recieve_address === "") {
        return res.json({ message: "Please fill all fields" });
    }

    next();
}


module.exports = router;
