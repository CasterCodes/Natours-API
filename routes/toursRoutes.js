import express from "express";
import {
  getSingleTour,
  getAllTours,
  createTour,
  deleteTour,
  updateTour,
  getTourStat,
} from "../controllers/toursController.js";
import { protect, restrictTo } from "../controllers/authController.js";

const Router = express.Router();

Router.route("/tour-stats").get(getTourStat);

Router.route("/").get(protect, getAllTours).post(createTour);

Router.route("/:id")
  .patch(updateTour)
  .get(getSingleTour)
  .delete(protect, restrictTo("admin"), deleteTour);

export default Router;
