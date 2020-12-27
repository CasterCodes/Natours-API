import express from "express";
import {
  getAllUsers,
  getSingleUser,
  updateUser,
  createUser,
  deleteUser,
} from "../controllers/usersController.js";

const Router = express.Router();

Router.route("/").get(getAllUsers).post(createUser);

Router.route("/:id").get(getSingleUser).patch(updateUser).delete(deleteUser);

export default Router;
