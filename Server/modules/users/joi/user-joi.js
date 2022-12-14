/* ====================== /// <==> Variables Declaration <==> /// ====================== */
const joi = require("joi");

/* ================ /// <==> User Joi Validations <==> /// ================ */
/*
//==//userJoi is an object that contains all user apis schemas to check the validity of sent request.
this object attribures are [signupSchema, signinSchema, googleSigninSchema].
*/
const userJoi = {
  /* ================ /// <==> Signup-Schema <==> /// ================ */

  signupSchema: {
    body: joi
      .object()
      .required()
      .keys({
        name: joi.string().required(),
        email: joi
          .string()
          .email({
            minDomainSegments: 2,
            tlds: { allow: ["com", "net"] },
          })
          .required(),
        password: joi.string().required(),
        confirmPassword: joi.string().required(),
        pic: joi.string().required(),
      }),
  },

  /* ================ /// <==> Signin-Schema <==> /// ================ */

  signinSchema: {
    body: joi
      .object()
      .required()
      .keys({
        email: joi
          .string()
          .email({
            minDomainSegments: 2,
            tlds: { allow: ["com", "net"] },
          })
          .required(),
        password: joi.string().required(),
      }),
  },

  /* ================ /// <==> Google-Schema <==> /// ================ */

  googleSigninSchema: {
    body: joi
      .object()
      .required()
      .keys({
        email: joi
          .string()
          .email({
            minDomainSegments: 2,
            tlds: { allow: ["com", "net"] },
          })
          .required(),
        name: joi.string().required(),
        pic: joi.string().required(),
      }),
  },

  /* ================ /// <==> Search-Schema <==> /// ================ */

  searchUsersByEmailOrNameSchema: {
    headers: joi
      .object()
      .required()
      .keys({
        authorization: joi.string().required(),
      })
      .options({ allowUnknown: true }),

    query: joi.object().required().keys({
      searchWord: joi.string().required(),
    }),
  },
};

/* ============= /// <==> Exports User Joi Validations <==> /// ============= */
module.exports = userJoi;
