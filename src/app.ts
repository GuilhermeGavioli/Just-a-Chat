import express from 'express'
import http from "http"
import cors from "cors"
import path from "path"
import dotenv from "dotenv"
dotenv.config();

import { Server } from "socket.io"


const app = express();
app.use(express.static(path.join(__dirname + "/..", "/public")));


app.use(cors())




let messages = {
    room1: [
        {owner: "Chat Bot", ownerID: "0", message:"Welcome to Room 1", time: ""},
    ],
    room2: [
        {owner: "Chat Bot", ownerID: "0", message:"Welcome to Room 2", time: ""},
    ],
    room3: [
        {owner: "Chat Bot", ownerID: "0", message:"Welcome to Room 3", time: ""},
    ],
    room4: [
        {owner: "Chat Bot", ownerID: "0", message:"Welcome to Room 4", time: ""},
    ],
}

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_ORIGIN_URL,
        methods: ["GET", "POST"]
    }
})



io.on("connection", (socket) => {

    
    socket.emit("socketID", socket.id)

    socket.on("send-message", data => {
        const date = new Date();
        switch (data.room) { 
            case "room1":
                messages.room1.push({owner: data.owner, ownerID: data.ownerID, message: data.message, time: date.getHours() + ":" +  date.getMinutes()})
                break;
            case "room2":
                messages.room2.push({owner: data.owner, ownerID: data.ownerID, message: data.message, time: date.getHours() + ":" +  date.getMinutes()})
                break;
            case "room3":
                messages.room3.push({owner: data.owner, ownerID: data.ownerID, message: data.message, time: date.getHours() + ":" +  date.getMinutes()})
                break;
            case "room4":
                messages.room4.push({owner: data.owner, ownerID: data.ownerID, message: data.message, time: date.getHours() + ":" +  date.getMinutes()})
                break;
        }
        socket.to(data.room).emit("send-message-callback", { owner: data.owner, message: data.message, status: 200, ownerID: data.ownerID, time: date.getHours() + ":" +  date.getMinutes()})
        
    })

    socket.on("join-room", (data) => {
        
        switch (data.room) { 
            case "room1":
                socket.emit("old-messages", messages.room1)
                break;
            case "room2":
                socket.emit("old-messages", messages.room2)
                break;
            case "room3":
                socket.emit("old-messages", messages.room3)
                break;
            case "room4":
                socket.emit("old-messages", messages.room4)
                break;
        }

        socket.join(data.room)
        socket.to(data.room).emit("join-room-callback", {message: `${data.nickname} has joined the room`, time: new Date().getHours() + ":" + new Date().getMinutes() })
    })




})

app.get("/chat", (req, res) => {
    const { room, nickname } = req.query
    if (room !== "room1" && room !== "room2" && room !== "room3" && room !== "room4") { return res.json({ error: "Room does not exist" }) }
   


    if (!room || !nickname) return res.json({error: "No nickname or room provided..."})
    res.sendFile(path.join(__dirname + "/.." + "/public/chat.html"))
})



server.listen(3001, () => console.log("Server is running"))




