const router = require("express").Router();
const Beneficiary = require("../models/beneficiarySchema");
const jwt = require("jsonwebtoken");

// get all beneficiaries
router.get("/", async (req, res) => {
    try {
        const token = req.cookies.token || req.headers['token'] || req.body.token;
        if(!token || token === null || token === undefined){
            return res.json({message: "Unauthorized", status: "warning"})
        }
        const verifyUser = jwt.verify(token, process.env.JWT_SECRET);
        if(!verifyUser){
            return res.json({message: "User not found (Invalid user)", status: "warning"})
        }

        const beneficiaries = await Beneficiary.find({user: verifyUser.id }).sort({ createdAt: -1 });
        res.json({beneficiaries, status: "success"});
    } catch (err) {
        res.json({ message: err });
    }
});

// create new Beneficiary 
router.post("/", validateBeneficiary, async (req, res) => {
    const { name, identification_no, relationship, email, address, contact } = req.body;
    const token = req.cookies.token || req.headers['token'] || req.body.token;

    try {
        if(!token || token === null || token === undefined){
            return res.json({message: "Unauthorized", status: "warning"})
        }
        const verifyUser = jwt.verify(token, process.env.JWT_SECRET);
        if(!verifyUser){
            return res.json({message: "User not found (Invalid user)", status: "warning"})
        }

        const findBeneficiaryEmail = await Beneficiary.findOne({ email });
        if(findBeneficiaryEmail){
            return res.json({message: "Beneficiary with this email already exists", status: "warning"})
        }
        const findBeneficiaryIdNo = await Beneficiary.findOne({ identification_no });
        if(findBeneficiaryIdNo){
            return res.json({message: "Identification number already exist.", status: "warning"})
        }
        const beneficiary = new Beneficiary({
            user: verifyUser.id,
            name,
            identification_no,
            relationship,
            email,
            address,
            contact
        });

        const saved_beneficiary = await beneficiary.save();
        res.json({ message: "Benefeciary added", status: "success", beneficiary: saved_beneficiary});
    } catch (err) {
        res.json({ message: err });
    }

});

function validateBeneficiary(req, res, next) {
    const { name, identification_no, relationship, email, address, contact } = req.body;

    if (!name || !identification_no || !relationship || !email || !address || !contact || name === "" || identification_no === "" || relationship === "" || email === "" || address === "" || contact === "") {
        return res.status(200).json({ message: "All fields are required", status: "warning" });
    }

    next();
}


module.exports = router;
