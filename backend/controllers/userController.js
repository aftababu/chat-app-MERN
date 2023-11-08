const asyncHandler = require("express-async-handler");
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/errorhandler");
const User = require("../models/userModel");
const sendToken = require("../utils/sendToken");

exports.registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  // console.log(req.body);
  if (!name || !email || !password) {
    return next(new ErrorHandler("All Fields are Required", 400));
  }
  const userExists = await User.findOne({ email });

  if (userExists) {
    return next(new ErrorHandler("User Already Exists", 400));
  }
  const file = req.files.pic;
  // console.log(req.files)
  const myCloud = await cloudinary.v2.uploader.upload(file.tempFilePath, {
    folder: "myChatApp",
    width: 150,
    crop: "scale",
  });
  const user = await User.create({
    name,
    email,
    password,
    pic: myCloud.secure_url,
  });
  if (user) {

    sendToken(user, 201, res);
  } else {
    return next(new ErrorHandler("Failed to create User", 400));
  }
});

exports.loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("All Fields are Required", 400));
  }
  const user = await User.findOne({ email });
  // console.log(user);
  if (user && (await user.matchPassword(password))) {
    // const newUser = {
    //   _id: user._id,
    //   name: user.name,
    //   email: user.email,
    //   pic: user.pic
    // };
    sendToken(user, 200, res);
  } else {
    return next(new ErrorHandler("Invalid Email or Password", 400));
  }
});

exports.getallUser = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.status(200).json({
    success: true,
    users,
  });
});


exports.getUserDetail=asyncHandler(async(req,res)=>{
    const user = await User.findById(req.user)
    res.status(200).json({
        success: true,
        user
    })
})