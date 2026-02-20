const mongoose = require('mongoose');
require('dotenv').config();

function db(){
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("DB Connected...");
    }).catch((error)=>{
        console.log(error);
    });
}

module.exports = db;