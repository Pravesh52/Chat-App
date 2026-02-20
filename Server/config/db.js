const mongoose = require('mongoose');

function db(){
    mongoose.connect('mongodb+srv://Pravesh52:Pravesh52@cluster0.r4dpczk.mongodb.net/').then(()=>{
        console.log("DB Connected...");
    }).catch((error)=>{
        console.log(error);
    });
}

module.exports = db;