import express from "express";
import morgan from "morgan";
import toursRoutes from "./routes/toursRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import globalErrorHandler from "./controllers/errorController.js";
import AppError from "./utils/AppError.js";

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//middlewares
app.use(express.json());

app.use("/api/v1/tours", toursRoutes);

app.use("/api/v1/users", usersRoutes);

// handling an unhandled routes
app.all("*", (req, res, next) => {
  // const error = new Error(`Can't find the ${req.originalUrl}`);
  // error.statusCode = 404;
  // error.status = "fail";
  next(new AppError(`Can't find the ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

export default app;
