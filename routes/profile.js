const router = require('express').Router();
const upload = require('../config/upload')
const User = require('../models/userSchema');
const jwt = require('jsonwebtoken');



//get profile details from token
router.get('/', async (req, res) => {
    try {
        const token = req.cookies.token || req.headers['token'] || req.body.token;
        if (!token) {
            return res.status(401).json({
                message: 'Unauthorized',
                status: "error"
            })
        }

        const id = jwt.verify(token, process.env.JWT_SECRET).id;
        const user = await User.findById(id);
        res.status(200).json({
            message: 'Profile fetched successfully',
            user,
            status: "success"
        })
    } catch (error) {
        return res.json({
            message: error,
            status: "error"
        })
    }
})


// upload profile image
router.post('/upload', upload.single('profile'), async (req, res) => {
    try {
        const token = req.cookies.token || req.headers['token'] || req.body.token;
        if (!token) {
            return res.status(401).json({
                message: 'Unauthorized',
                status: "error"
            })
        }

        const id = jwt.verify(token, process.env.JWT_SECRET).id;
        //update user profile
        const updateUser = await User.findByIdAndUpdate(id);

        //get file path as url
        const url = req.protocol + '://' + req.get('host');
        const profile = url + '/' + req.file.filename;

        //get user id from token 
        updateUser.profile = profile;
        await updateUser.save();

        res.status(200).json({
            message: 'Profile updated successfully',
            profile,
            status: "success"
        })

    } catch (error) {
        return res.json({
            message: error,
            status: "error"
        })
    }
})

// update profile 
router.patch('/', async (req, res) => {
    try {
        const token = req.cookies.token || req.headers['token'] || req.body.token;
        if (!token) {
            return res.status(401).json({
                message: 'Unauthorized',
                status: "error"
            })
        }
        const id = jwt.verify(token, process.env.JWT_SECRET).id;
        //update user profile
        const updateUser = await User.findByIdAndUpdate(id, req.body, { new: true });
        const saveUser = await updateUser.save();

        res.status(200).json({
            message: 'Profile updated successfully',
            user: saveUser,
            status: "success"
        })

    } catch (error) {
        return res.json({
            message: error,
            status: "error"
        })
    }
})

// update profile by admin
router.patch('/:id', async (req, res) => {
    try {
        const token = req.cookies.token || req.headers['token'] || req.body.token;
        const _id = req.params.id;
        if (!token) {
            return res.status(401).json({
                message: 'Unauthorized',
                status: "error"
            })
        }

        const admin = jwt.verify(token, process.env.JWT_SECRET);
        if(admin.role !== "admin"){
            return res.status(401).json({
                message: 'Unauthorized',
                status: "error"
            })
        }

        //update user profile
        const updateUser = await User.findByIdAndUpdate(_id, req.body, { new: true });
        const saveUser = await updateUser.save();

        res.status(200).json({
            message: 'Profile updated successfully',
            user: saveUser,
            status: "success"
        })

    } catch (error) {
        return res.json({
            message: error,
            status: "error"
        })
    }
})



module.exports = router;