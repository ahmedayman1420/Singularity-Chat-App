// ====== --- ====== > Import Modules & Variables Declaration < ====== --- ====== //
const mongoose = require("mongoose");

// ====== --- ====== > Message-Schema < ====== --- ====== //
/*
//==// messageSchema: it contains fields of chat collection with some restrictions like
(required, max, min) and some options like (default value, enum).
message fields is [content, sender, chat, isDeleted].
*/
const messageSchema = mongoose.Schema(
  {
    content: { type: String, required: true },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },

    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chats",
    },

    isDeleted: { type: Boolean, default: false },
  },

  {
    timestamps: true, // To save (creation, update) time
  }
);

// ====== --- ====== > Message-Model < ====== --- ====== //
const messages = mongoose.model("messages", messageSchema); // create message collection with given (name, schema).

// ====== --- ====== > export message model < ====== --- ====== //
module.exports = messages;
