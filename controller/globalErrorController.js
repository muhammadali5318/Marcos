const { JsonWebTokenError } = require("jsonwebtoken");
const AppError = require("../utils/AppError");

const sendDevError = (error, req, res) => {
  const status = error?.status || 'Internal server error';
  const statusCode = error?.statusCode || 500;
  const message = error.message;
  const stack = error.stack;

  console.log(error.name, error.message, stack);

  return res.status(statusCode).json({
    status: status,
    message: message,
    stack: stack,
  });
};

const sendProdError = (error, req, res) => {
  const status = error.status;
  const statusCode = error.statusCode;
  const message = error.message;

  if (error.isOperational) {
    return res.status(statusCode).json({
      status: status,
      message: message,
    });
  }

  return res.status(500).json({
    status: "Error",
    message: "Something went wrong",
  });
};

const globalErrorHandler = (err, req, res, next) => {
  
  if(err.name === "JsonWebTokenError") {
    err = new AppError("Invalid Token", 401)
  }

  if (err.name === "SequelizeUniqueConstraintError" || err.name === "SequelizeValidationError") {
    err = new AppError(err.errors[0].message, 400);
  }
  if (process.env.NODE_ENV === "development") {
    sendDevError(err, req, res, next);
  } else sendProdError(err, req, res, next);
};

module.exports = globalErrorHandler;
