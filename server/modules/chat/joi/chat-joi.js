/* ====================== /// <==> Variables Declaration <==> /// ====================== */
const joi = require("joi");

/* ================ /// <==> Chat Joi Validations <==> /// ================ */
/*
//==//chatJoi is an object that contains all chat apis schemas to check the validity of sent request.
this object attribures are [accessChatSchema].
*/
const chatJoi = {
  /* ================ /// <==> Access-Chat-Schema <==> /// ================ */

  accessChatSchema: {
    headers: joi
      .object()
      .required()
      .keys({
        authorization: joi.string().required(),
      })
      .options({ allowUnknown: true }),

    params: joi.object().required().keys({
      id: joi.string().required(),
    }),
  },

  /* ================ /// <==> Get-User-All-Chats <==> /// ================ */

  getAllUserChatsSchema: {
    headers: joi
      .object()
      .required()
      .keys({
        authorization: joi.string().required(),
      })
      .options({ allowUnknown: true }),
  },

  /* ================ /// <==> Create-New-Group-Chat <==> /// ================ */

  CreateGroupChatSchema: {
    headers: joi
      .object()
      .required()
      .keys({
        authorization: joi.string().required(),
      })
      .options({ allowUnknown: true }),

    body: joi
      .object()
      .required()
      .keys({
        usersId: joi
          .array()
          .items(joi.string().hex().length(24).required())
          .required(),
        chatName: joi.string().required(),
      }),
  },

  /* ================ /// <==> Rename-Chat-Group <==> /// ================ */

  RenameChatGroupSchema: {
    headers: joi
      .object()
      .required()
      .keys({
        authorization: joi.string().required(),
      })
      .options({ allowUnknown: true }),

    body: joi.object().required().keys({
      chatName: joi.string().required(),
    }),

    params: joi
      .object()
      .required()
      .keys({
        id: joi.string().hex().length(24).required(),
      }),
  },

  /* ================ /// <==> Remove-Chat-Member <==> /// ================ */

  RemoveChatMemberSchema: {
    headers: joi
      .object()
      .required()
      .keys({
        authorization: joi.string().required(),
      })
      .options({ allowUnknown: true }),

    body: joi
      .object()
      .required()
      .keys({
        userId: joi.string().hex().length(24).required(),
      }),

    params: joi
      .object()
      .required()
      .keys({
        id: joi.string().hex().length(24).required(),
      }),
  },

  /* ================ /// <==> Add-Chat-Member <==> /// ================ */

  AddChatMemberSchema: {
    headers: joi
      .object()
      .required()
      .keys({
        authorization: joi.string().required(),
      })
      .options({ allowUnknown: true }),

    body: joi
      .object()
      .required()
      .keys({
        userId: joi.string().hex().length(24).required(),
      }),

    params: joi
      .object()
      .required()
      .keys({
        id: joi.string().hex().length(24).required(),
      }),
  },
};

/* ============= /// <==> Exports Chat Joi Validations <==> /// ============= */
module.exports = chatJoi;
