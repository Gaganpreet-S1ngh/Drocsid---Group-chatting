import express from "express";
import dotenv from "dotenv";
import path from "path";
import http from "http";
import { formatMessage } from "./utils/formatMessage.js";
import { Server } from "socket.io";
import { fileURLToPath } from 'url';
import { getCurrentUser, userJoin, userLeaves, getRoomUsers } from "./utils/user.js"

const app = express();
const server = http.createServer(app);
const io = new Server(server)
const PORT = process.env.PORT || 5001


//dotenv config
dotenv.config();

//set static folder

// Define __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

//run when a client connects

io.on("connection", socket => {
    //joining the room

    socket.on("JoinRoom", ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        // this is to only the client
        //Welcoming the current user
        socket.emit("New Message", formatMessage("Drocsid Bot", `Welcome to Drocsid! ${username}`)); // sending it to client side

        //this is to everyone except the client
        //joining the chat

        socket.broadcast.to(user.room).emit("New Message", formatMessage("Drocsid Bot", `${username} has joined the chat!`));


        //send user and room info

        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })


    //listen for incoming msgs from client sides

    socket.on("chatMessage", (msg) => {
        //after recieving to backend we emit it to everybody
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit("New Message", formatMessage(user.username, msg));
    })


    //disconnecting from the chat

    socket.on("disconnect", () => {
        const user = userLeaves(socket.id);
        io.to(user.room).emit("New Message", formatMessage("Drocsid Bot", `${user.username} has left the chat!`));

        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })

    //send user and room info


})




server.listen(PORT, () => {
    console.log(`Listening to port : ${PORT}`);
})
