const express = require('express');
let router = express();
const User = require('../models/User');
const Chat = require('../models/Chat');
const auth = require('../middleware/auth');

router.get('/chat/:to', auth, async (req, res)=>{
    try{
        const to = req.params.to;
        const from = req.user._id;
        const sender = await User.findById(from);
        const receiver = await User.findById(to);
        if(!sender || !receiver){
            return res.status(404).send("User not found");
        }
        const chats = await Chat.find({$or: [
            { from, to },
            { from: to, to: from }
        ]}).sort({ createdAt: 1 });
        return res.status(200).json(chats);
    }
    catch(error){
        console.log(error);
        return res.status(500).send("Some error occured");
    }
})

router.post('/savechat', auth, async(req, res)=>{
    try{
        const {to, from, message} = req.body;
        const sender = await User.findById(from);
        const receiver = await User.findById(to);
        if(!sender || !receiver){
            return res.status(404).send("User not found");
        }
        const chat = new Chat({
            from,
            to,
            message
        });
        await chat.save();
        return res.status(200).send("Chat saved");
    }
    catch(error){
        console.log(error);
        return res.status(500).send("Some error occured");
    }
})

module.exports = router;