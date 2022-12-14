import bcrypt from "bcrypt";
import User from "../Models/User.js";
import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Validator } from "node-input-validator";
import { genrateToken } from "../utils/genrateToken.js";
import { checkValidation, failed } from "../config/helper.js";
dotenv.config();

export const authUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //Validator------------------------------Start
  const v = new Validator(req.body, {
    email: "required|email",
    password: "required",
  });
  const value = JSON.parse(JSON.stringify(v));
  const validationResponse = await checkValidation(v);
  if (validationResponse) {
    return failed(res, validationResponse);
  }
  //Validator------------------------------End

  const user = await User.findOne({ email: value.inputs.email });
  if (user && (await bcrypt.compare(value.inputs.password, user.password))) {
    const token = genrateToken(user._id);
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isVerified: user.isVerified,
      Login_Time: (await token).time,
      token: (await token).token,
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.person._id);
  if (user) {
    res.send({
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isVerified: user.isVerified,
    });
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
};

export const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.person.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.password, salt);
      user.password = hash;
    }
    const updatedUser = await user.save();
    res.send({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      isVerified: updatedUser.isVerified,
    });
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
};

// @desc Delete User By id
// @route Delete / user / deleteUser/:id
// @access Private/Admin
export const deleteUserByAdmin = expressAsyncHandler(async (req, res) => {
  const result = await User.findById(req.params.id);
  if (result) {
    await result.remove();
    res.json({ message: "User Removed" });
  } else {
    res.status(404);
    res.send("User Not Found");
  }
});
// @desc Get a User By id
// @route Get /user/admin/getAUser/:id
// @access Private/Admin
export const getAUserByAdmin = expressAsyncHandler(async (req, res) => {
  const result = await User.findById(req.params.id);
  if (result) {
    res.json(result);
  } else {
    res.status(404);
    res.send("User Not Found");
  }
});

// @desc Get a User By id and Update
// @route Get /user/admin/updateAUser/:id
// @access Private/Admin
export const updateUserByAdmin = async (req, res) => {
  const { name, email, isAdmin, isVerified } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, {
    name,
    email,
    isAdmin,
    isVerified,
  });
  if (user) {
    res.send({
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isVerified: user.isVerified,
    });
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
};
