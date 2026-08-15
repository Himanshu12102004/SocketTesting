const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(express.static("public"));

const ROOM = "game";

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  socket.join(ROOM);

  // Receive ping from one client
  socket.on("ping-all", () => {
    console.log(`${socket.id} sent a ping`);

    // Broadcast to everyone in the room
    io.to(ROOM).emit("ping-received", {
      from: socket.id,
    });
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
