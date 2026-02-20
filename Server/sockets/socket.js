// const jwt = require('jsonwebtoken');

// const onlineUsers = {};

// module.exports = (io) =>{
//     io.use((socket, next)=>{
//         const token = socket.handshake.auth.token;
//         try{
//             const user = jwt.verify(token, "PRIVATESTRING");
//             socket.user = user;
//             next();
//         }
//         catch{
//             next(new Error("Unauthorized"));
//         }
//     })
//     io.on("connection", (socket)=>{
//         onlineUsers[socket.user._id] = socket.id;
//         io.emit("online_users", Object.keys(onlineUsers));
//         socket.on("private_message", ({to, message})=>{
//             const targetId = onlineUsers[to];
//             if(targetId){
//                 io.to(targetId).emit("receive_private_message", {
//                     from: socket.user._id,
//                     message
//                 })
//             }
//         })
//         socket.on("disconnect", ()=>{
//             delete onlineUsers[socket.user.userName];
//             io.emit("online_users", Object.keys(onlineUsers));
//         })
//     })
// }


const jwt = require("jsonwebtoken");

const onlineUsers = {};

module.exports = (io) => {

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Unauthorized - No Token"));
    }

    try {
      const user = jwt.verify(token, "PRIVATESTRING");
      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Unauthorized - Invalid Token"));
    }
  });

  io.on("connection", (socket) => {

    console.log("Connected:", socket.user._id);

    // ✅ Store user correctly
    onlineUsers[socket.user._id] = socket.id;

    io.emit("online_users", Object.keys(onlineUsers));

    socket.on("private_message", ({ to, message }) => {

      const targetSocketId = onlineUsers[to];

      if (targetSocketId) {
        io.to(targetSocketId).emit("receive_private_message", {
          from: socket.user._id,
          to: to,              // ✅ IMPORTANT FIX
          message,
        });
      }
    });

    socket.on("disconnect", () => {

      console.log("Disconnected:", socket.user._id);

      // ✅ Correct delete
      delete onlineUsers[socket.user._id];

      io.emit("online_users", Object.keys(onlineUsers));
    });

  });

};
