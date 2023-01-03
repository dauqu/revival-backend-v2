const router = require('express').Router();
const IncomeStreams = require('../models/streamSchema');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');

// get all income streams
router.get('/', async (req, res) => {
    try {
        // get token 
        const token = req.headers["token"] || req.cookies.token || req.body.token;
        // check token 
        if (!token) 
            return res.status(401).json({ message: "Access denied. No token provided.", status: "error" });

        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(decoded.id === undefined || decoded.id === null || decoded.id === ""){
            return res.status(401).json({ message: "Access denied. Invalid token.", status: "error" });
        }

        // get user id
        const userId = decoded.id;

        // get all income streams
        const i_streams = await IncomeStreams.find({ user: userId }).sort({ createdAt: -1 });
        const getUser = await User.findById(userId);

        // send income streams
        return res.status(200).json({ streams: i_streams, user: getUser, status: "success" });
    } catch (error) {
        res.status(500).json({ message: error, status: "error" });
    }
});


// create new income stream 
router.post('/', async (req, res) => {
    const {refer, income} = req.body;

    try {
        // get token
        const token = req.headers["token"] || req.cookies.token || req.body.token;
        // check token
        if (!token)
            return res.status(401).json({ message: "Access denied. No token provided.", status: "error" });
        
        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(decoded.id === undefined || decoded.id === null || decoded.id === ""){
            return res.status(401).json({ message: "Access denied. Invalid token.", status: "error" });
        }
        
        // get user id
        const userId = decoded.id;

        // create new income stream 
        const newStream = new IncomeStreams({
            user: userId,
            refer: req.body.refer,
            income: req.body.income
        });

        // save income stream
        const savedStream = await newStream.save();

        // send saved income stream
        return res.status(200).json({ stream: savedStream, message: "Stream found", status: "success" });
    } catch (error) {
        res.status(500).json({ message: error, status: "error" });
    }
});






module.exports = router;