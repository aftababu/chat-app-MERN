const expressAsyncHandler = require("express-async-handler");
const ErrorHandler = require("../utils/errorhandler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthorized = expressAsyncHandler(async (req, res, next) => {
  // let token;
  // if (
  //   req.headers.authorization &&
  //   req.headers.authorization.startsWith("Bearer")
  // ) {
  //   try {
  //     token = req.headers.authorization.split(" ")[1];
  //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
  //     console.log(decoded)
  //     req.user = await User.findById(decoded.id).select("-password");
  //     next();
  //   } catch (error) {
  //     return next(new ErrorHandler("Not Authorized Token Failed"), 401);
  //   }
  // }
  // // console.log(token)
  const {token} = req.cookies

  if (!token) {
    return next(new ErrorHandler("Please Login to access this resource"), 401);
  }
  try{
    const decoded = jwt.verify(token,process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id).select("-password");
    // console.log(req.user)
    next()
  }catch(error){
    return next(new ErrorHandler("Not Authorized Token Failed"), 401);
  }
  // const decoded = jwt.verify(token,process.env.JWT_SECRET)
  // console.log(decoded)
  // req.user=decoded.id
  // console.log(req.user)
  // next()
});
