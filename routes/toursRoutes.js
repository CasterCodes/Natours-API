import express from "express";
import {
  getSingleTour,
  getAllTours,
  createTour,
  deleteTour,
  updateTour,
  getTourStat,
} from "../controllers/toursController.js";

const Router = express.Router();

Router.route("/tour-stats").get(getTourStat);

Router.route("/").get(getAllTours).post(createTour);

Router.route("/:id").patch(updateTour).get(getSingleTour).delete(deleteTour);

export default Router;
