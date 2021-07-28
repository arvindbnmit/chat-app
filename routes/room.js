const router = require("express").Router();
const roomlists = require("../models/Room");
const User = require("../models/User");
const Message = require("../models/Message");

router.post("/createroom", async (req, res) => {
  const addRoom = new roomlists({
    roomName: req.body.roomName,
  });
  addRoom.save().then((room) => {
    res.status(200).json({
      success: true,
      data: room,
    });
  });
});
router.get("/", async (req, res) => {
  roomlists.find({}, (error, rooms) => {
    if (error) {
      throw error;
    }
    res.status(200).json({
      success: true,
      data: rooms,
    });
  });
});

router.post("/enterroom", async (req, res) => {
  const addUser = new User({
    userName: req.body.userName,
    roomId: req.body.roomId,
  });
  addUser.save().then((user) => {
    res.status(200).json({
      success: true,
      data: user,
    });
  });
});

router.post("/sendmessage", async (req, res) => {
  const sendMessage = new Message({
    roomId: req.body.roomId,
    userId: req.body.userId,
    message: req.body.message,
  });
  sendMessage.save().then((message) => {
    res.status(200).json({
      success: true,
      data: message,
    });
  });
});

router.delete("/:id", async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

module.exports = router;
