const jwt = require('jsonwebtoken');

const onlineUsers = {};

module.exports = (io) =>{
    io.use((socket, next)=>{
        const token = socket.handshake.auth.token;
        try{
            const user = jwt.verify(token, "PRIVATESTRING");
            socket.user = user;
            next();
        }
        catch{
            next(new Error("Unauthorized"));
        }
    })
    io.on("connection", (socket)=>{
        onlineUsers[socket.user._id] = socket.id;
        io.emit("online_users", Object.keys(onlineUsers));
        socket.on("private_message", ({to, message})=>{
            const targetId = onlineUsers[to];
            if(targetId){
                io.to(targetId).emit("receive_private_message", {
                    from: socket.user._id,
                    message
                })
            }
        })
        socket.on("disconnect", ()=>{
            delete onlineUsers[socket.user.userName];
            io.emit("online_users", Object.keys(onlineUsers));
        })
    })
}

