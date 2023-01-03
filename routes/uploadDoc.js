const router = require('express').Router();

const upload = require('../config/upload');
const User = require('../models/userSchema');

router.post('/passport/:id', upload.single('passport'), async (req, res) => {
    try {
        const url = req.protocol + '://' + req.get('host')+'/'+ req.file.filename;
        const user = await User.findByIdAndUpdate(req.params.id);
        user.passport = url;
        await user.save();
        res.json({message: "Passport uploaded successfully", status: "success"});
    } catch (error) {
        res.json({message: error.message, status: "error"});
    }
});

router.post('/national-id/:id', upload.single('national_id'), async (req, res) => {
    try {
        const url = req.protocol + '://' + req.get('host')+'/'+ req.file.filename;
        const user = await User.findByIdAndUpdate(req.params.id);
        user.national_id = url;
        await user.save();
        res.json({message: "National Id uploaded successfully", status: "success"});
    } catch (error) {
        res.json({message: error.message, status: "error"});
    }
});

module.exports = router;
