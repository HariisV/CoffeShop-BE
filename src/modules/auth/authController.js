const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { request, response } = require("express");
const redis = require("../../config/redis");
const authModel = require("./authModel");
const helperWrapper = require("../../helper/wraper");
const sendMail = require("../../helper/email");
require("dotenv").config();

module.exports = {
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
      const cekUser = await authModel.checkUser(email);
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
  verifEmail: async (request, response) => {
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
      const cekUser = await authModel.checkUser(email);
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
};
