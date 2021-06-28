import express from "express";
import {
  getAllUsers,
  getSingleUser,
  updateUser,
  createUser,
  deleteUser,
} from "../controllers/usersController.js";

import {
  signUp,
  login,
  protect,
  restrictTo,
  resetPassword,
  forgotPassword,
} from "../controllers/authController.js";

const Router = express.Router();

Router.route("/forgot-password").post(forgotPassword);

Router.route("/reset-password/:token").patch(resetPassword);

Router.route("/signup").post(signUp);

Router.route("/login").post(login);

Router.route("/").get(protect, getAllUsers).post(protect, createUser);

Router.route("/:id")
  .get(protect, getSingleUser)
  .patch(protect, updateUser)
  .delete(protect, deleteUser);

export default Router;
