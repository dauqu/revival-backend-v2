const router = require('express').Router();
const upload = require('../config/upload')
const User = require('../models/userSchema');
const jwt = require('jsonwebtoken');

// get all users

router.get("/", async (req, res) => {
    const getallusers = await User.find();
    res.status(200).json({
        message: "All users fetched successfully",
        users: getallusers,
        status: "success"
    });
})
module.exports = router;