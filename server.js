import dotenv from "dotenv";
import connection from "./config/Database.js";
dotenv.config({});

import app from "./app.js";

connection();

process.on("uncaughtException", (error) => {
  console.log(error.name, error.message);
  console.log("UncaughtException. Shutting down");
  process.exit(1);
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(`Server running on  port ${PORT}`)
);

process.on("unhandledRejection", (error) => {
  console.log(error.name, error.message);
  console.log("UnhandledRejection. Shutting down");
  server.close(() => {
    process.exit(1);
  });
});
