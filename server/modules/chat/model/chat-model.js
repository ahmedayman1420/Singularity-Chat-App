// ====== --- ====== > Import Modules & Variables Declaration < ====== --- ====== //
const mongoose = require("mongoose");

// ====== --- ====== > Chat-Schema < ====== --- ====== //
/*
//==// chatSchema: it contains fields of chat collection with some restrictions like
(required, max, min) and some options like (default value, enum).
chat fields is [chatName, isGroup, users, latestMessage, groupAdmin, isDeleted].
*/
const chatSchema = mongoose.Schema(
  {
    chatName: { type: String, required: true },
    isGroup: { type: Boolean, required: true },
    users: [
      { type: mongoose.Schema.Types.ObjectId, required: true, ref: "users" },
    ],

    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "messages",
    },

    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },

    isDeleted: { type: Boolean, default: false },
  },

  {
    timestamps: true, // To save (creation, update) time
  }
);

// ====== --- ====== > Chat-Model < ====== --- ====== //
const chats = mongoose.model("chats", chatSchema); // create chat collection with given (name, schema).

// ====== --- ====== > export chat model < ====== --- ====== //
module.exports = chats;
