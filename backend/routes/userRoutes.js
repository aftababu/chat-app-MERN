const express = require("express");

const router = express.Router();


const {registerUser,loginUser, getallUser, getUserDetail} = require('../controllers/userController');
const { isAuthorized } = require("../middleware/auth");

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route('/users').get(isAuthorized,getallUser)
router.route('/me').get(isAuthorized,getUserDetail)


module.exports = router;
