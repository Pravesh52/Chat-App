const express = require('express');
const db = require('./config/db');
const router = require('./controllers/authController');
const userData = require('./routers/userData');
const chatData = require('./routers/chatData');
let app = express();
const cors = require('cors');
const http = require('http');
const {Server} = require('socket.io');


const initSocket = require('./sockets/socket');

db();

app.use(cors({
    origin:["http://localhost:5173","https://dapper-tapioca-de6dbd.netlify.app"]
}));
app.use(cors());
app.use(express.json())
app.use('/api',router);
app.use('/userdata', userData);
app.use('/chatdata', chatData);
// console.log(router);

const server = http.createServer(app);

const io = new Server(server, {
    cors:{
        origin:["http://localhost:5173","https://dapper-tapioca-de6dbd.netlify.app"],
        methods:["GET","POST"]
    }
})


initSocket(io);

server.listen(4000, ()=>{
    console.log("Server running on port no 4000");
})