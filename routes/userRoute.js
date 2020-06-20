const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../database/model/user');
const moment = require('moment');

/**
 * login / sign in
 */
router.post('/login', async (req,res) => {
    const {gmail, password} = req.body;

    let user = null;
    try {
        user = await User.findOne({
            gmail: gmail
        }).select('+password').exec()
    } catch (e) {
        return res.json({
            message: 'Cannot query user',
            data: null,
            error: e
        })
    }

    if(!user){
        return res.json({
            message: 'No user founded!',
            data: null
        })
    }

    let validatePassword = false;
    try{
        validatePassword = await bcrypt.compare(password, user.password);
    } catch (e) {
        return res.json({
            message: 'Cannot check the password',
            data: null,
            error: e,
        })
    }

    if(!validatePassword){
        return res.json({
            message: 'password does not match',
            data: null
        })
    }

    const userObject = user.toObject();
    delete userObject.password;

    return res.json({
        message: 'auth successful',
        data: userObject
    })
})

/**
 * register / sign up
 */
router.post('/register', async (req,res) => {
    const {gmail, password, dob, name, tel, address} = req.body;

    const checkUser = await User.findOne({
        gmail: gmail
    })

    if(checkUser){
        return res.json({
            message: 'User exist !'
        })
    }

    if(!gmail || !password || name || tel || address){
        return res.json({
            message: 'Must input gmail !'
        })
    }

    if(!moment(dob).isValid()){
        return res.json({
            message: 'Day of birth is invalid format'
        })
    }

    if(moment.diff(dob, "year") < 12){
        return res.json({
            message: 'You need permission of your parent to register !'
        })
    }

    let hashedPassword = null;

    try{
        hashedPassword = await bcrypt.hash(password, 10);
    }catch (e) {
        return res.status(500).json({
            message: 'Hashing failure',
            data: null,
            error: e,
        });
    }

    const user = new User({
        gmail: gmail,
        password: hashedPassword,
        name: name,
        dob: dob,
        tel: tel,
        address: address
    })

    await user.save();

    return res.json({
        message: 'Create account successfully !',
        data: user.name
    })
})

router.post('/view', async (req, res) => {
    const id = req.body._id;
    const user = await User.findOne({
        _id: id
    }).exec();

    if(!user){
        return res.json({
            message: 'Cannot found user in database',
            data: null
        })
    }

    return res.json({
        message: 'User founded',
        data: user
    })
})
