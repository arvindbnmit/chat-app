const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server);

io.on("connection", (socket) => {
  console.log("Connected: " + socket.userId);

  socket.on("disconnect", () => {
    console.log("Disconnected: " + socket.userId);
  });

  socket.on("joinRoom", ({ roomId }) => {
    socket.join(roomId);
    console.log("A user joined chatroom: " + roomId);
  });

  socket.on("leaveRoom", ({ roomId }) => {
    socket.leave(roomId);
    console.log("A user left chatroom: " + roomId);
  });

  socket.on("receiveMessage", async ({ roomId, message }) => {
    if (message.trim().length > 0) {
      const user = await User.findOne({ _id: socket.userId });

      io.to(roomId).emit("newMessage", {
        message,
        name: user.name,
        userId: socket.userId,
      });
      await newMessage.save();
    }
  });
});
