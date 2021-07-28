const mongoose = require("mongoose");
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);

const room = require("./routes/room");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(require("cors")());

app.use("/rooms", room);

const db =
  "mongodb+srv://mongoUser:mongo123@cluster0.yoxe1.mongodb.net/chatApp?retryWrites=true&w=majority";

mongoose.connect(db, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
});

mongoose.connection.on("error", (err) => {
  console.log("Mongoose Connection ERROR: " + err.message);
});

mongoose.connection.once("open", () => {
  console.log("MongoDB Connected!");
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

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

      io.to(roomId).emit("details", {
        message,
        name: user.name,
        userId: socket.userId,
        roomId: socket.roomId,
      });
    }
  });

  socket.on("getAllUsers", async ({ roomId }) => {
    const users = await User.find({ _id: socket.userId });

    io.to(roomId).emit("users", { users });
  });
});
