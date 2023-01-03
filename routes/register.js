const express = require("express");
const router = express.Router();

const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { getAmount, calculateAmout, updateUpperLevel } = require("../config/referalProcess");

router.get("/", (req, res) => {
	res.json({
		message: "Welcome to the API",
	});
});

router.post("/", validateRegister, async (req, res) => {
	//Hash password
	const hashed_password = await bcrypt.hash(req.body.password, 10);

	// assign amount 
	let amount = getAmount(req.body.level || 1);


	//Save user to database
	const save_user = new User({
		name: req.body.name,
		profile: req.body.profile || "https://placeimg.com/192/192/peoples",
		phone: req.body.phone,
		email: req.body.email,
		country: req.body.country,
		username: req.body.username,
		password: hashed_password,
		level: 1,
	});

	//check referal and get user who referred this user
	const referal = req.body?.referal;
	const findReferal = await User.findOne({ username: referal });

	// invalid referal 
	if(referal && !findReferal) {
		return res.status(200).json({ message: "Invalid referal", status: "error" });
	}

	if (findReferal) {
		// get referal user and update his earning
		let referred_by = await User.findOneAndUpdate({ username: referal });
		referred_by.total_referral += 1;
		await referred_by.save();

		save_user.referred_by = referred_by._id;

		//update upperlevel
		// let reducedAmount = await updateUpperLevel(referred_by._id, amount, 0, 5, true);

		//update user total earning
		save_user.total_earning = 0;
		save_user.total_referral_earning = 0;
		save_user.total_referral = 0;
	}

	try {
		const this_user = await save_user.save();
		res.status(200).json({
			message: "User created successfully",
			status: "success",
			user: this_user,
		});
	} catch (error) {
		res.status(400).json({ message: error.message, status: "error" });
	}
});

//Middleware for register validation
async function validateRegister(req, res, next) {
	const { name, phone, email, username, password } = req.body;

	//Check if all fields are filled
	if (
		name === "" ||
		phone === "" ||
		email === "" ||
		username === "" ||
		password === "" ||
		name === undefined ||
		phone === undefined ||
		email === undefined ||
		username === undefined ||
		password === undefined ||
		name === null ||
		phone === null ||
		email === null ||
		username === null ||
		password === null
	) {
		return res
			.status(200)
			.json({ message: "All fields are required", status: "warning" });
	}

	//Check password length
	if (password.length < 6) {
		return res.status(200).json({
			message: "Password must be at least 6 characters long",
			status: "warning",
		});
	}

	//Check if user exists
	const user = await User.findOne({ email: req.body.email });
	if (user)
		return res.status(200).json({
			message: "Email already exists",
			status: "warning",
		});

	//Check email is valid
	const email_regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	if (!email_regex.test(email))
		return res.status(200).json({
			message: "Email is not valid",
			status: "warning",
		});

	//Check Username is valid
	const username_regex = /^[a-zA-Z0-9]+$/;
	if (!username_regex.test(username))
		return res.status(200).json({
			message: "Username is not valid",
			status: "warning",
		});

	//Check username is unique
	const user_exists = await User.findOne({ username: username });
	if (user_exists)
		return res.status(200).json({
			message: "Username is already taken",
			status: "warning",
		});

	//Check phone is valid
	const phone_regex = /^[0-9]{10}$/;
	if (!phone_regex.test(phone))
		return res.status(200).json({
			message: "Phone is not valid",
			status: "warning",
		});

	//Check phone is unique
	const phone_exists = await User.findOne({ phone: phone });
	if (phone_exists)
		return res.status(200).json({
			message: "Phone is already exists",
			status: "warning",
		});

	next();
}

module.exports = router;