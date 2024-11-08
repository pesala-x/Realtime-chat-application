const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
    const username = socket.handshake.query.username;

    io.emit("user connected", username);

    socket.on("send message", (data) => {
        io.emit("receive message", { ...data, delivered: true });
    });

    socket.on("user typing", (username) => {
        socket.broadcast.emit("show typing", username);
    });

    socket.on("user stopped typing", () => {
        socket.broadcast.emit("hide typing");
    });

    socket.on("add reaction", (data) => {
        io.emit("reaction added", data);
    });

    socket.on("disconnect", () => {
        io.emit("user disconnected", username);
    });
});

server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
