// ====== --- ====== > Import Modules & Variables Declaration < ====== --- ====== //
const { StatusCodes } = require("http-status-codes");
const users = require("../../users/model/user-model");
const chats = require("../model/chat-model");

// ====== --- ====== > Chat Methods < ====== --- ====== //

/*
//==// AccessChat: is the logic of '/chat/:id' api that used to get chat between two users.
the response of this function in success (chat), in failure (show error message).
*/
const accessChat = async (req, res) => {
  try {
    let { id } = req.params;
    let { email } = req.decoded;

    const oldUser = await users.findOne({ email, isDeleted: false });
    if (oldUser) {
      // ====== --- ====== > Get chat between two users < ====== --- ====== //

      const oldChat = await chats
        .findOne({
          isGroup: false,
          $and: [
            { $users: { $elemMatch: { $eq: oldUser._id } } },
            { $users: { $elemMatch: { $eq: id } } },
          ],
        })
        .populate("users")
        .populate("latestMessage")
        .populate({
          path: "latestMessage",
          populate: {
            path: "sender",
          },
        });

      // ====== --- ====== > Chat is already found < ====== --- ====== //

      if (oldChat)
        res.status(StatusCodes.OK).json({
          message: "Chat Found",
          payload: { chat: oldChat },
        });
      // ====== --- ====== > Create new chat between two users < ====== --- ====== //
      else {
        const newChat = new chats({
          chatName: "Singularity",
          isGroup: false,
          users: [oldUser._id, id],
        });
        const data = await newChat.save();

        const createdChat = await chats
          .findOne({
            _id: data._id,
          })
          .populate("users")
          .populate("latestMessage")
          .populate({
            path: "latestMessage",
            populate: {
              path: "sender",
            },
          });

        res.status(StatusCodes.OK).json({
          message: "Chat Created",
          payload: { chat: createdChat },
        });
      }
    } else
      res.status(StatusCodes.BAD_REQUEST).json({ message: "User not Found !" });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

/*
//==// GetUserChats: is the logic of '/user/chats' api that used to get all user chats.
the response of this function in success (chats), in failure (show error message).
*/
const getUserChats = async (req, res) => {
  try {
    let { email } = req.decoded;

    const oldUser = await users.findOne({ email, isDeleted: false });
    if (oldUser) {
      const userChats = await chats
        .find({
          users: { $elemMatch: { $eq: oldUser._id } },
        })
        .populate("users")
        .populate("groupAdmin")
        .populate("latestMessage")
        .populate({
          path: "latestMessage",
          populate: {
            path: "sender",
          },
        })
        .sort({ updatedAt: -1 });

      res.status(StatusCodes.OK).json({
        message: "Chats Found",
        payload: { chats: userChats },
      });
    } else
      res.status(StatusCodes.BAD_REQUEST).json({ message: "User not Found !" });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

/*
//==// CreateChatGroup: is the logic of '/chat/group/create' api that used to create chat group.
the response of this function in success (chat group details), in failure (show error message).
*/
const createChatGroup = async (req, res) => {
  try {
    let { email } = req.decoded;
    let { usersId, chatName } = req.body;

    const oldUser = await users.findOne({ email, isDeleted: false });
    if (oldUser) {
      const newChatGroup = new chats({
        chatName,
        isGroup: true,
        users: [...usersId, oldUser._id],
        groupAdmin: oldUser._id,
      });
      const data = await newChatGroup.save();

      const chatGroup = await chats
        .find({
          _id: data._id,
        })
        .populate("users")
        .populate("groupAdmin")
        .populate("latestMessage")
        .populate({
          path: "latestMessage",
          populate: {
            path: "sender",
          },
        });

      res.status(StatusCodes.OK).json({
        message: "Chats Found",
        payload: { chats: chatGroup },
      });
    } else
      res.status(StatusCodes.BAD_REQUEST).json({ message: "User not Found !" });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

/*
//==// updateGroupName: is the logic of '/chat/rename/:id' api that used to rename chat group.
the response of this function in success (new chat group), in failure (show error message).
*/
const updateGroupName = async (req, res) => {
  try {
    let { email } = req.decoded;
    let { chatName } = req.body;
    let { id } = req.params;

    const oldUser = await users.findOne({ email, isDeleted: false });
    if (oldUser) {
      const newChat = await chats
        .findByIdAndUpdate(id, { chatName }, { new: true })
        .populate("users")
        .populate("groupAdmin")
        .populate("latestMessage")
        .populate({
          path: "latestMessage",
          populate: {
            path: "sender",
          },
        });

      res.status(StatusCodes.OK).json({
        message: "Chat name updated",
        payload: { chat: newChat },
      });
    } else
      res.status(StatusCodes.BAD_REQUEST).json({ message: "User not Found !" });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

/*
//==// deleteUserFromChatGroup: is the logic of '/chat/user/:id' api that used to delete user from chat group.
the response of this function in success (new chat group), in failure (show error message).
*/
const deleteUserFromChatGroup = async (req, res) => {
  try {
    let { email } = req.decoded;
    let { userId } = req.body;
    let { id } = req.params;

    const oldUser = await users.findOne({ email, isDeleted: false });
    if (oldUser) {
      const newChat = await chats
        .findByIdAndUpdate(id, { $pull: { users: userId } }, { new: true })
        .populate("users")
        .populate("groupAdmin")
        .populate("latestMessage")
        .populate({
          path: "latestMessage",
          populate: {
            path: "sender",
          },
        });
      res.status(StatusCodes.OK).json({
        message: "User removed from chat group",
        payload: { chat: newChat },
      });
    } else
      res.status(StatusCodes.BAD_REQUEST).json({ message: "User not Found !" });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

/*
//==// AddUserToChatGroup: is the logic of '/chat/user/:id' api that used to add user to chat group.
the response of this function in success (new chat group), in failure (show error message).
*/
const addUserToChatGroup = async (req, res) => {
  try {
    let { email } = req.decoded;
    let { userId } = req.body;
    let { id } = req.params;

    const oldUser = await users.findOne({ email, isDeleted: false });
    if (oldUser) {
      const newChat = await chats
        .findByIdAndUpdate(id, { $push: { users: userId } }, { new: true })
        .populate("users")
        .populate("groupAdmin")
        .populate("latestMessage")
        .populate({
          path: "latestMessage",
          populate: {
            path: "sender",
          },
        });
      res.status(StatusCodes.OK).json({
        message: "User added to chat group",
        payload: { chat: newChat },
      });
    } else
      res.status(StatusCodes.BAD_REQUEST).json({ message: "User not Found !" });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

// ====== --- ====== > Export Module < ====== --- ====== //
module.exports = {
  accessChat,
  getUserChats,
  createChatGroup,
  updateGroupName,
  deleteUserFromChatGroup,
  addUserToChatGroup,
};
