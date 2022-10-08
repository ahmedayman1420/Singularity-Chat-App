// ====== --- ====== > Import Modules & Variables Declaration < ====== --- ====== //
const express = require("express");
const router = express.Router();

const chatFunctions = require("../controller/chat-control");
const chatSchemas = require("../joi/chat-joi");

const validateRequest = require("../../../Common/Middlewares/requestValidation");
const chatEndpoints = require("../chatEndpoints");
const isAuthorized = require("../../../Common/Middlewares/isAuthorized");
/*
//==// require express to create sub-object that will used to contains user apis
//==// chatFunctions: it's an object that contains all chat apis logic
//==// chatSchemas: it's an object that contains all chat apis schemas
//==// validateRequest: it's a function that used validate schema with sent request
*/

// ====== --- ====== > User Routes < ====== --- ====== //

// search api
router.post(
  "/chat/:id",
  validateRequest(chatSchemas.accessChatSchema),
  isAuthorized(chatEndpoints.AccessChatAPI),
  chatFunctions.accessChat
);

// get user chats api
router.get(
  "/user/chats",
  validateRequest(chatSchemas.getAllUserChatsSchema),
  isAuthorized(chatEndpoints.GetUserChatsAPI),
  chatFunctions.getUserChats
);

// create chat group api
router.post(
  "/chat/group/create",
  validateRequest(chatSchemas.CreateGroupChatSchema),
  isAuthorized(chatEndpoints.CreateGroupChatAPI),
  chatFunctions.createChatGroup
);

// rename chat group api
router.patch(
  "/chat/rename/:id",
  validateRequest(chatSchemas.RenameChatGroupSchema),
  isAuthorized(chatEndpoints.RenameChatGroupAPI),
  chatFunctions.updateGroupName
);

// remove chat member api
router.delete(
  "/chat/user/:id",
  validateRequest(chatSchemas.RemoveChatMemberSchema),
  isAuthorized(chatEndpoints.RemoveChatMemberAPI),
  chatFunctions.deleteUserFromChatGroup
);

// add chat member api
router.post(
  "/chat/user/:id",
  validateRequest(chatSchemas.AddChatMemberSchema),
  isAuthorized(chatEndpoints.AddChatMemberAPI),
  chatFunctions.addUserToChatGroup
);
// ====== --- ====== > Export Module < ====== --- ====== //
module.exports = router;
