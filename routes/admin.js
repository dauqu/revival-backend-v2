// get all admin 
const router = require('express').Router();
const Admin = require('../models/adminSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');


router.get('/', async (req, res) => {
    const token = req.cookies.token || req.headers['token'] || req.body.token;
    try {

        // check token is valid 
        const check_token = jwt.verify(token, process.env.JWT_SECRET);
        if (!check_token) {
            return res.json({ status: "error", message: "Invalid token" })
        }
        // get id from token
        const check_admin = jwt.decode(token);
        // check admin is valid
        if (check_admin.role !== 'admin') {
            return res.json({ status: "error", message: "You are not an admin" })
        }
        // get all admins
        const alladmins = await Admin.find().select('-password');

        res.json({ status: "success", admins: alladmins })
    } catch (error) {
        res.json({ status: "error", message: error.message })
    }
});

router.post('/isloggedin', async (req, res) => {
    const token = req.cookies.token || req.headers['token'] || req.body.token;
    try {
        const check_token = jwt.verify(token, process.env.JWT_SECRET);
        if (!check_token) {
            return res.json({ status: "error", message: "Invalid token",loggedin: false })

        }
        const check_admin = jwt.decode(token);
        if (check_admin.role !== 'admin') {
            return res.json({ status: "error", message: "You are not an admin", loggedin: false })
        }
        const admin = await Admin.findById(check_admin.id).select('-password');

        res.json({ status: "success", message: "You are logged in", admin: admin, loggedin: true })
    } catch (error) {
        res.json({ status: "error", message: error.message })
    }
})


// admin login 
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({ status: "error", message: "Please fill all the fields" })
        }

        // check email 
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.json({ status: "error", message: "Invalid credentials" })
        }

        const check = await bcrypt.compare(password, admin.password);
        if (!check) {
            return res.json({ status: "error", message: "Invalid credentials" })
        }

        // create token
        const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            maxAge: 24 * 60 * 60 * 1000
        })

        res.json({ status: "success", message: "Login successfully", token, admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role } })
    }
    catch (err) {
        res.json({ status: "error", message: err.message })
    }
})


//update user block status by admin
router.patch('/change-block/:id', async (req, res) => {
    const token = req.cookies.token || req.headers['token'] || req.body.token;
    try {
        //check token
        const check_token = jwt.verify(token, process.env.JWT_SECRET);
        if (!check_token) {
            return res.json({ status: "error", message: "Invalid token" })
        }

        //check admin
        const check_admin = jwt.decode(token);
        if (check_admin.role !== 'admin') {
            return res.json({ status: "error", message: "You are not an admin" })
        }
        //get user
        const user = await User.findByIdAndUpdate(req.params.id);
        if (!user) {
            return res.json({ status: "error", message: "User not found" })
        }
        // change block status 
        user.blocked = !user.blocked;
        await user.save();
        res.json({ status: "success", message: "User block status updated successfully" })
    } catch (error) {
        res.json({ status: "error", message: error.message })
    }
})


//delete user 
router.delete('/delete-user/:id', async (req, res) => {
    const token = req.cookies.token || req.headers['token'] || req.body.token;
    try {

        //check token
        const check_token = jwt.verify(token, process.env.JWT_SECRET);
        if (!check_token) {
            return res.json({ status: "error", message: "Invalid token" })
        }

        //check admin
        const check_admin = jwt.decode(token);
        if (check_admin.role !== 'admin') {
            return res.json({ status: "error", message: "You are not an admin" })
        }
        
        //delete user
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.json({ status: "error", message: "User not found" })
        }
        res.json({ status: "success", message: "User deleted successfully" })
    } catch (error) {
        res.json({ status: "error", message: error.message })
    }
})





// add new admin
router.post('/add', validateAdmin, async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashed_passwd = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({
            name,
            email,
            password: hashed_passwd,
            role: req.body?.admin || "admin"
        })
        await newAdmin.save();
        res.json({ status: "success", message: "Admin added successfully" })
    } catch (error) {
        res.json({ status: "error", message: error.message })
    }
})

async function validateAdmin(req, res, next){
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.json({ status: "error", message: "Please fill all the fields" })
    }

    // check if email is already registered
    const admin = await Admin.findOne({ email });
    if (admin) {
        return res.json({ status: "error", message: "Email already registered" })
    }

    next();
}




module.exports = router;