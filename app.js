import express from "express";
import morgan from "morgan";
import toursRoutes from "./routes/toursRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//middlewares
app.use(express.json());

app.use("/api/v1/tours", toursRoutes);

app.use("/api/v1/users", usersRoutes);

export default app;
