const AsyncHandler = require("express-async-handler");
const ErrorHandler = require("../utils/errorhandler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModels");

exports.sendMessage = AsyncHandler(async (req, res, next) => {
  const { content, chatID } = req.body;
  if (!content || !chatID) {
    return next(new ErrorHandler("Invalid data passed into request", 400));
  }
  //   console.log(req.user)
  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatID,
  };
  try {
    let message = await Message.create(newMessage);
    console.log("message");
    let populatedMessage = await message.populate("sender", "name pic");
    populatedMessage = await populatedMessage.populate("chat");
    populatedMessage = await User.populate(populatedMessage, {
      path: "chat.users",
      select: "name pic email",
    });
    const updatedChat = await Chat.findByIdAndUpdate(chatID, {
      latestMessage: populatedMessage,
    });
    res.json(populatedMessage);
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

exports.allMessage = AsyncHandler(async (req, res, next) => {
  try {
    const message = await Message.find({ chat: req.params.chatID })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(message);
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});
