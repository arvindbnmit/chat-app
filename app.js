const express = require("express");

const room = require("./routes/room");

const mongoose = require("mongoose");

const http = require("http");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Setup Cross Origin
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

const server = http.createServer(app);

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
