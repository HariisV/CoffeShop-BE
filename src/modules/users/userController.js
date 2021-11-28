const helperWrapper = require("../../helper/wraper");
const userModel = require("./userModel");
const authModel = require("../auth/authModel");
const bcrypt = require("bcrypt");
const deleteFile = require("../../helper/file/delete");
require("dotenv").config();

module.exports = {
  getUserById: async (req, res) => {
    try {
      const user = req.params.id;
      // console.log(req.params.id);
      // console.log(user);
      const rest = await userModel.getUserById(user);
      return helperWrapper.response(res, 200, `Success Get User`, rest);
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad Request ${error.message}`,
        null
      );
    }
  },
  updateProfile: async (req, res) => {
    try {
      const data = req.body;
      const user = req.decodeToken;
      const setData = {
        email: data.email,
        phoneNumber: data.phoneNumber,
        address: data.address,
        userName: data.userName,
        firstName: data.firstName,
        lastName: data.lastName,
        birthDay: data.birthDay,
        gender: data.gender,
        updatedAt: new Date(),
      };
      Object.keys(setData).forEach((element) => {
        if (!setData[element]) {
          delete setData[element];
        }
      });
      const Result = await userModel.updateUser(setData, user.email);
      return helperWrapper.response(res, 200, `Success Update`, Result);
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad Request ${error.message}`,
        null
      );
    }
  },
  updatePassword: async (req, res) => {
    try {
      const { oldPassword, newPassword, confirmPassword } = req.body;
      const user = req.decodeToken;
      const checkUser = await authModel.checkUserByEmail(user.email);
      if (!oldPassword || !newPassword || !confirmPassword) {
        return helperWrapper.response(res, 400, `Please Input All Field`);
      }
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
      const checkPassword = await bcrypt.compare(
        oldPassword,
        checkUser[0].password
      );
      if (!checkPassword) {
        return helperWrapper.response(res, 400, "Your Password Wrong");
      }
      //   console.log(object)
      const setData = {
        password: await bcrypt.hash(newPassword, 10),
        updatedAt: new Date(),
      };

      const Result = await userModel.updateUser(setData, user.email);
      return helperWrapper.response(res, 200, `Success Change Password`, null);
    } catch (error) {
      return helperWrapper.response(
        res,
        400,
        `Bad Request ${error.message}`,
        null
      );
    }
  },
  updateImage: async (req, res) => {
    try {
      const { filename } = req.file;
      const user = req.decodeToken;
      const setData = {
        image: filename,
        updatedAt: new Date(),
      };
      const Result = await userModel.updateUser(setData, user.email);
      console.log(user);
      if (user.image) {
        deleteFile(`user/${user.image}`);
      }
      return helperWrapper.response(
        res,
        200,
        `Success Update Image Profile`,
        Result
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
  deleteImage: async (req, res) => {
    try {
      const user = req.decodeToken;

      const setData = {
        image: null,
        updatedAt: new Date(),
      };
      if (user.image) {
        deleteFile(`user/${user.image}`);
      }
      await userModel.updateUser(setData, user.email);
      return helperWrapper.response(res, 200, `Success Deleted Image`, null);
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
