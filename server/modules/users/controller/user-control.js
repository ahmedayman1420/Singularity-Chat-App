// ====== --- ====== > Import Modules & Variables Declaration < ====== --- ====== //
const users = require("../model/user-model");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const { generatePassword } = require("./services");

// ====== --- ====== > User Methods < ====== --- ====== //

/*
//==// signUp: is the logic of '/signup' api that used to create new user with (name, email, password, age) fields.
the response of this function in success (Sign up Successfully), in failure (show error message).
*/
const signUp = async (req, res) => {
  try {
    let { name, email, password, confirmPassword, pic } = req.body;

    const oldUser = await users.findOne({ email, isDeleted: false });
    if (!oldUser) {
      if (password === confirmPassword) {
        const newUser = new users({ name, email, password, pic });
        const data = await newUser.save();

        var token = jwt.sign(
          {
            data: { name: data.name, email: data.email, role: data.role },
            exp: Math.floor(Date.now() / 1000) + 60 * 60,
          },
          process.env.ENCRYPT_KEY
        );

        res.status(StatusCodes.CREATED).json({
          message: "Sign up Successfully",
          payload: { token, user: newUser },
        });
      } else {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "Password not matched confirm passwords" });
      }
    } else {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Email is Already Found" });
    }
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

/*
//==// signin: is the logic of '/signin' api that used to sign in to website.
the response of this function in success (Sign in Successfully), in failure (show error message).
*/
const signIn = async (req, res) => {
  try {
    let { email, password } = req.body;
    const oldUser = await users.findOne({ email, isDeleted: false });
    if (oldUser) {
      let cdate = Date.now();
      let match = bcrypt.compare(
        password,
        oldUser.password,
        function (err, result) {
          if (result) {
            var token = jwt.sign(
              {
                data: {
                  name: oldUser.name,
                  email: oldUser.email,
                  role: oldUser.role,
                },
                exp: Math.floor(cdate / 1000) + 60 * 60,
              },
              process.env.ENCRYPT_KEY
            );
            res.status(StatusCodes.OK).json({
              message: "Sign in Successfully",
              payload: { token, user: oldUser },
            });
          } else {
            res
              .status(StatusCodes.BAD_REQUEST)
              .json({ message: "Incorrect Password !" });
          }
        }
      );
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({ message: "User Not Found !" });
    }
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

/*
//==// Google signin: is the logic of '/google' api that used to continue with google.
the response of this function in success (User login with google success), in failure (show error message).
*/
const googleSignIn = async (req, res) => {
  try {
    let { name, email, pic } = req.body;
    const oldUser = await users.findOne({ email, isDeleted: false });
    if (oldUser) {
      var token = jwt.sign(
        {
          data: {
            name: oldUser.name,
            email: oldUser.email,
            role: oldUser.role,
          },
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
        },
        process.env.ENCRYPT_KEY
      );
      res.status(StatusCodes.OK).json({
        message: "Sign in Successfully with Google",
        payload: { token, user: oldUser },
      });
    } else {
      const randomPassword = generatePassword();
      const newUser = new users({ name, email, password: randomPassword, pic });
      const data = await newUser.save();

      var token = jwt.sign(
        {
          data: { name: data.name, email: data.email, role: data.role },
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
        },
        process.env.ENCRYPT_KEY
      );

      res.status(StatusCodes.CREATED).json({
        message: "Sign up Successfully with Google",
        payload: { token, user: newUser },
      });
    }
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

/*
//==// searchUsersByEmailOrName: is the logic of '/search' api that used to get users with (name, email) fields.
the response of this function in success (users), in failure (show error message).
*/

const searchUsersByEmailOrName = async (req, res) => {
  try {
    let { searchWord } = req.query;
    let { email } = req.decoded;

    const oldUser = await users.findOne({ email });
    if (oldUser) {
      const data = await users
        .find({
          $or: [
            { name: { $regex: searchWord, $options: "i" } },
            { email: { $regex: searchWord, $options: "i" } },
          ],
        })
        .find({ email: { $ne: email } });

      res.status(StatusCodes.CREATED).json({
        message: "Found Users",
        payload: { users: data },
      });
    } else
      res.status(StatusCodes.BAD_REQUEST).json({ message: "User Not Found !" });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
};

// ====== --- ====== > Export Module < ====== --- ====== //
module.exports = {
  signUp,
  signIn,
  googleSignIn,
  searchUsersByEmailOrName,
};
