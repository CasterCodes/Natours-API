import AppError from "./../utils/AppError.js";
const sendDevelopmentError = (error, res) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      stack: error.stack,
      error: error,
      message: error.message,
    });
  } else {
    console.log(error);
    res.status(500).json({
      status: error.status,
      message: "Something went very wrong",
    });
  }
};

const sendProductionError = (error, res) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
};

const globalErrorHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendDevelopmentError(error, res);
  } else if (process.env.NODE_ENV === "production") {
    sendProductionError(error, res);
  }

  next();
};

export default globalErrorHandler;
