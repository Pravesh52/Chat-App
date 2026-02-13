let express = require('express');
let router = express();
const jwt = require('jsonwebtoken');
const User = require('../models/User.js')
const bcrypt = require('bcrypt');

router.post('/signup', async (req, res) => {
   let { userName, email, passWord } = req.body
   // console.log(userName, email, "heheh");

   let user = await User.findOne({ email })

   if (user) {
      res.status(401).send("User already have an account")
   }
   else{
      let updatedP = await bcrypt.hash(passWord, 10)
      let userData = new User({
         userName,
         email,
         passWord: updatedP
      })
      await userData.save()
      res.status(200).send("Account created")
   }
})

router.post('/login',async (req, res)=>{
   let {email, passWord} = req.body
   let userInfo = await User.findOne({email})
   if(!userInfo){
      res.status(402).send("Account not found!");
   }
   else{
      let validPass = await bcrypt.compare(passWord,userInfo.passWord);
      if(validPass){
         let token = jwt.sign({_id:userInfo._id, email: userInfo.email, userName:userInfo.userName }, "PRIVATESTRING");
         console.log(token);
         res.status(200).send(`${token}`);
      }
      else{
         res.status(404).send("Wrong Password");
      }
   }
})

module.exports = router;