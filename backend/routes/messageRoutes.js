const express = require("express");
const {
  allMessage,
  sendMessage,
} = require("../controllers/messageControllers");

const router = express.Router();

const {isAuthorized} = require("../middleware/auth");

router.route("/message").post(isAuthorized, sendMessage);
router.route("/message/:chatID").get(isAuthorized, allMessage);

module.exports = router;
