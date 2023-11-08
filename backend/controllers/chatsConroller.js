const Chat = require("../models/chatModels");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const ErrorHandler = require("../utils/errorhandler");

exports.accessChats = asyncHandler(async (req, res) => {
  const { userID } = req.body;
  console.log(userID);
  if (!userID) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }
  var isChats = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userID } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");
  isChat = await User.populate(isChats, {
    path: "latestMessage.sender",
    select: "name pic email",
  });
  if (isChats.length > 0) {
    res.send(isChats[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userID],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (err) {
      return new ErrorHandler(err.message, 400);
    }
  }
});

exports.fetchChats = asyncHandler(async (req, res) => {
  // console.log(req.user)
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

exports.createGroup = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return ErrorHandler("Please Fill all the feilds",400)
  }
  var users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return new ErrorHandler('user should be more than 2',400)
    
  }
  users.push(req.user);
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(fullGroupChat);
  } catch (error) {
    return new ErrorHandler(error.message, 400);
  }
});

exports.renameGroup = asyncHandler(async (req, res) => {
  const { chatID, chatName } = req.body;
  const updatedChat = await Chat.findByIdAndUpdate(
    chatID,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!updatedChat) {
    return new ErrorHandler("Chat Not Found", 404);
  } else {
    res.json(updatedChat);
  }
});

// exports.deleteGroup = asyncHandler(async (req, res) => {
//   const { chatID ,userID} = req.body;
//   const deletedChat = await Chat.findByIdAndDelete(chatId);
//   if (!deletedChat) {
//     return new ErrorHandler("Chat Not Found", 404);
//   }
//   res.json(deletedChat);
// })

exports.removeFromGroup = asyncHandler(async (req, res) => {
  const { chatID, userID } = req.body;
  // console.log(chatID,userID)
  const deletedChat = await Chat.findByIdAndUpdate(
    chatID,
    {
      $pull: { users: userID },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!deletedChat) {
    return new ErrorHandler("Chat Not Found", 404);
  } else {
    res.json(deletedChat);
  }
});


exports.addToGroup = asyncHandler(async (req, res) => {
  const { chatID, userID } = req.body;
  const added = await Chat.findByIdAndUpdate(
    chatID,
    {
      $push: { users: userID },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!added) {
    return new ErrorHandler("Chat Not Found", 404);
  } else {
    res.json(added);
  }
})
