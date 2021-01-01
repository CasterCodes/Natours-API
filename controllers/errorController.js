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

const sendCastError = (error) => {
  const message = `Invalid ${error.path} of value ${error.value} `;
  return new AppError(message, 404);
};

const globalErrorHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_ENV === "development") {
    let err = { ...error };
    if (err.kind === "ObjectId") err = sendCastError(error);
    sendDevelopmentError(err, res);
  } else if (process.env.NODE_ENV === "production") {
    sendProductionError(error, res);
  }

  next();
};

export default globalErrorHandler;
