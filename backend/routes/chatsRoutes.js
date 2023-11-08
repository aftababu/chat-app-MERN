const mongoose = require("mongoose");
const express = require("express");
const { isAuthorized } = require("../middleware/auth");
const { accessChats, fetchChats, createGroup, renameGroup, removeFromGroup, addToGroup } = require("../controllers/chatsConroller");

const router = express.Router();

router.route('/chats').post(isAuthorized,accessChats).get(isAuthorized,fetchChats)
router.route('/newgroup').post(isAuthorized,createGroup)
router.route('/group/rename').put(isAuthorized,renameGroup)
router.route('/group/removefromgroup').delete(isAuthorized,removeFromGroup)
router.route('/group/addtogroup').post(isAuthorized,addToGroup)

module.exports = router