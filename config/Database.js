import mongoose from "mongoose";
const connection = async () => {
  try {
    const url = process.env.DATABASE_URL.replace(
      "<PASSWORD>",
      process.env.DATABASE_PASSWORD
    );
    await mongoose.connect(url, {
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true,
    });
    console.log(`Connected to mongo`);
  } catch (error) {
    console.log(error.name);
    process.exit(1);
  }
};
export default connection;
