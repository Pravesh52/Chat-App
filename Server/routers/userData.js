const express = require('express')
let router = express();
const User = require('../models/User');
const auth = require('../middleware/auth')

router.get('/getUsers', auth, async (req, res)=>{
    try{
        const users = await User.find({_id:{$ne: req.user._id}}).select('-passWord');
        res.status(200).json(users);
    }
    catch(error){
        console.log(error);
        res.status(400).send("Some error occured");
    }
})

router.get('/me', auth, async (req, res)=>{
    try{
        const userId = req.user._id;
        const data = await User.findById(userId).select('-passWord');
        res.status(200).json(data);
    }
    catch(error){
        console.log(error);
        res.status(400).send("Some Error Occured");
    }
})

router.get('/getUser', auth, async(req, res)=>{
    try{
        const {userId} = req.body;
        const data = await User.findById(userId).select('-passWord');
        res.status(200).json(data);
    }
    catch(error){
        console.log(error);
        res.status(400).send("Some Error Occured");
    }
})

module.exports = router;