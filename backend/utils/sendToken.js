
const sendToken = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();
    // console.log(tdoken)
    const options = {
        expires: new Date(
          Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        sameSite: "None",
        secure: true,
      };
// console.log(user)
      res.status(statusCode).cookie("token", token, options).json({
        success: true,
        user,
        token
      })
}

module.exports = sendToken