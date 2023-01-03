const { Router } = require("express");
const router = Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require('../models/userSchema');
const { getAmount, calculateAmout, updateUpperLevel } = require("../config/referalProcess");

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (email === "" || password === "") {
        return res.json({ message: "Email and password is required", status: "warning" });
    }
    const findUser = await User.findOne({ email });
    if (!findUser) {
        return res.json({ message: "User not found", status: "warning" });
    }
    const isMatch = await bcrypt.compare(password, findUser.password);

    if (!isMatch) {
        return res.json({ message: "Password is incorrect", status: "warning" });
    }

    // check if user is blocked
    if (findUser.blocked === true) {
        return res.json({ message: "Your account is blocked", status: "warning" });
    }

    // signing token for 5 days 
    const token = jwt.sign({ id: findUser._id }, process.env.JWT_SECRET, { expiresIn: "5d" });

    // set cookie 
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    });

    res.json({ message: "Login successful", status: "success", token, user: findUser });
})

router.post("/register", async (req, res) => {
    const { name, username, email, country, phone, password, referal, level } = req.body;
    try {

        // console.log(referal);

        //check user name exists
        const findUser = await User.findOne({ username });
        if (findUser) {
            return res.json({ message: "Username already exists", status: "warning" });
        }

        //check email exists
        const findUserEmail = await User.findOne({ email });
        if (findUserEmail) {
            return res.json({ message: "Email already exists", status: "warning" });
        }
        // assign amount 
        let amount = getAmount(level);

        // //hash password
        const hashed_password = await bcrypt.hash(password, 10);
        
        //check referal
        // const findReferal = await User.findOne({ username: referal });
        // if (!findReferal) {
        //     return res.json({ message: "Invalid referal", status: "warning" });
        // }

        //get referrer details
        // const referred_by = await User.findOne({ username: referal });
        // console.log(referred_by._id);

        // //update upperlevel
        // let reducedAmount = await updateUpperLevel(referred_by._id, amount, 0, 5, true);

        //create new user
        const new_ref_user = new User({
            name,
            username: username.toLowerCase(),
            email,
            country,
            phone,
            // referal,
            level,
            password: hashed_password,
            // total_earning: Number(amount) - Number(reducedAmount),
            // total_referral_earning: Number(amount) - Number(reducedAmount),
            // referred_by: referred_by._id
        });

        // // save user 
        const saved_ref_user = await new_ref_user.save();

        // response 
        return res.json({ message: "User created successfully", status: "success", user: saved_ref_user });

    }
    catch (e) {
        res.json({ message: e, status: "error" });
    }
})

// check is logged in
router.get("/isloggedin", async (req, res) => {
    try {
        const token = req.body?.token || req.cookies["token"] || req.headers['token'];

        if (token == "" || token == null || token == undefined) {
            return res.json({ message: "No auth token", status: "warning" });
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) {
            return res.json({ message: "User not logged in", status: "warning" });
        }
        const findUser = await User.findById(verified.id
        ).select("-password");
        if (!findUser) {
            return res.json({ message: "User not logged in", status: "warning" });
        }
        return res.json({ message: "User logged in", status: "success", user: findUser });
    }
    catch (e) {
        return res.json({ message: e, status: "error" });
    }
})

router.get('/logout', (req, res) => {
    try {
        res.clearCookie("token");
        res.json({ message: "Logged out", status: "success" });
    } catch (error) {
        return res.json({ error, status: "error" })
    }
})


function validateRegister(req, res, next) {
    const { name, username, email, country, phone, password } = req.body;

    if (
        name === "" || username === "" || email === "" || country === "" || phone === "" || password === "" ||
        name === null || username === null || email === null || country === null || phone === null || password === null ||
        name === undefined || username === undefined || email === undefined || country === undefined || phone === undefined || password === undefined) {
        return res.json({ message: "All fields are required", status: "warning" });
    }

    next();
}

module.exports = router;