const mongoose = require('mongoose');

function db(){
    mongoose.connect('mongodb://127.0.0.1:27017/chatApp').then(()=>{
        console.log("DB Connected...");
    }).catch((error)=>{
        console.log(error);
    });
}

module.exports = db;