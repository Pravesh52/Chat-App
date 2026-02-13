const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
    {
        from:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        to:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        message:{
            type:String
        }
    },
    {timestamps:true}
)

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;