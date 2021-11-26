const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const redis = require("../../config/redis");
const authModel = require("./authModel");
const helperWrapper = require("../../helper/wraper");
const sendMail = require("../../helper/email");
require("dotenv").config();

module.exports = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const checkUser = await authModel.checkUserByEmail(email);

      if (checkUser.length < 1) {
        return helperWrapper.response(res, 400, "Your Email Is Wrong");
      }
      if (checkUser[0].isActive !== 1) {
        return helperWrapper.response(
          res,
          400,
          "Before Login, Verify Your Email"
        );
      }
      const checkPassword = await bcrypt.compare(
        password,
        checkUser[0].password
      );
      if (!checkPassword) {
        return helperWrapper.response(res, 400, "Your Password Wrong");
      }
      const data = checkUser[0];
      delete data.password;
      const token = jwt.sign({ ...data }, process.env.jwtKey, {
        expiresIn: 1 * 24 * 60 * 60,
      });
      redis.setex(`accessToken:${token}`, process.env.jwt_expire, token);
      const result = { id: data.id, token };

      return helperWrapper.response(res, 200, "Success login", result);
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad Request ${error.message}`,
        null
      );
    }
  },
  register: async (request, response) => {
    try {
      let { firstName, lastName, email, password, phoneNumber } = request.body;
      if (!firstName || !lastName || !email || !password || !phoneNumber) {
        return helperWrapper.response(
          response,
          400,
          `Please Fill First Name, Last Name, Email, Password And Phone Number`
        );
      }
      const cekGmail = email.search("@gmail.com");
      if (cekGmail == -1) {
        return helperWrapper.response(response, 403, "Please Only Use Gmail");
      }
      const cekUser = await authModel.checkUserByEmail(email);
      if (cekUser.length > 0) {
        return helperWrapper.response(
          response,
          400,
          "That Email Already Had an Account"
        );
      }
      if (password.length < 8) {
        return helperWrapper.response(
          response,
          400,
          "The minimum length of password is 8 character"
        );
      }
      const hashPass = await bcrypt.hash(password, 10);

      const setPostData = {
        id: uuidv4(),
        firstName,
        lastName,
        phoneNumber,
        email,
        password: hashPass,
        role: "user",
      };
      let result = await authModel.register(setPostData);

      const setDataEmail = {
        to: email,
        subject: "Verification Email",
        template: "email-verification",
        data: {
          firstName,
          lastName,
          id: result.id,
          link: `${process.env.URL_BACKEND}/auth/activation/${result.id}`,
        },
      };
      sendMail(setDataEmail);

      return helperWrapper.response(
        response,
        200,
        "Success Create Account, Check Your Email To Activation Your Email",
        result
      );
    } catch (error) {
      return helperWrapper.response(
        response,
        400,
        `Bad Request ${error.message}`,
        null
      );
    }
  },
  verifEmail: async (req, res) => {
    try {
      const id = req.params.id;
      const cekUser = await authModel.checkUserById(id);
      if (cekUser.length < 1) {
        return helperWrapper.response(res, 400, "User not found");
      }
      // 1 = AKTIF | 0 = NONAKTIF
      const setPostData = {
        isActive: 1,
      };
      let result = await authModel.updatedUser(setPostData, id);
      return helperWrapper.response(
        res,
        200,
        "Success Activated Account, Login Now",
        result
      );
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad Request ${error.message}`,
        null
      );
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const checkUser = await authModel.checkUserByEmail(email);
      if (checkUser.length < 1) {
        return helperWrapper.response(
          res,
          400,
          `User With Email : ${email} Not Found`
        );
      }
      const data = { email: checkUser[0].email, id: checkUser[0].id };
      const token = jwt.sign(data, process.env.jwtKey, {
        expiresIn: process.env.jwt_expire,
      });

      const setDataEmail = {
        to: email,
        subject: "Forgot Password",
        template: "email-verification",
        data: {
          link: `${process.env.URL_FRONTEND}/auth/reset-password/${token}`,
        },
      };
      sendMail(setDataEmail);

      return helperWrapper.response(
        res,
        200,
        "Success Forgot Password, Check Your Email",
        null
      );
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad Request ${error.message}`,
        null
      );
    }
  },
  forgotPasswordUpdate: async (req, res) => {
    try {
      const { email, id } = req.decodeToken;
      const { newPassword, confirmPassword } = req.body;
      if (newPassword !== confirmPassword) {
        return helperWrapper.response(res, 400, `Password Not Same`);
      }
      if (newPassword.length < 8) {
        return helperWrapper.response(
          res,
          400,
          `Minimum Password is 8 Character`
        );
      }
      const checkUser = await authModel.checkUserByEmail(email);
      if (checkUser.length < 1) {
        return helperWrapper.response(
          res,
          400,
          `User With Email : ${email} Not Found`
        );
      }

      const setPostData = {
        isActive: 1,
        password: await bcrypt.hash(newPassword, 10),
      };
      let result = await authModel.updatedUser(setPostData, id);

      return helperWrapper.response(
        res,
        200,
        "Success Update Passowrd, Login Now",
        result
      );
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad Request ${error.message}`,
        null
      );
    }
  },
  logout: async (req, res) => {
    try {
      let token = req.headers.authorization;
      if (token) {
        token = token.split(" "[1]);
        redis.del(`accesToken${token}`);
      }
      return helperWrapper.response(res, 200, "Success Logout", null);
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad Request ${error.message}`,
        null
      );
    }
  },
};
