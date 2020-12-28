import Tour from "./models/tourModel.js";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config({ path: "" });

import mongoose from "mongoose";
const url =
  "mongodb+srv://root2:code@castercluster.udpu7.mongodb.net/natourstwo?retryWrites=true&w=majority";

mongoose
  .connect(url, {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
  })
  .then(() => console.log("Connected"))
  .catch((error) => console.log(error));
const tours = JSON.parse(
  fs.readFileSync("./dev-data/data/tours-simple.json", "utf-8")
);

const importData = async () => {
  try {
    await Tour.deleteMany();
    await Tour.create(tours);
    console.log("Data was imported with success");
  } catch (error) {
    console.log(error);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log("Data deleted");
  } catch (error) {
    console.log("Data deleted");
  }
};

if (process.argv[2] === "import") {
  importData();
} else {
  deleteData();
}
