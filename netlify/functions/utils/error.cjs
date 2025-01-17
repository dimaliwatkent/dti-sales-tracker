const errorHandler = (statusCode, message) => {
  const error = new Error();
  error.statusCode = statusCode;
  error.message = message;
  return error;
};

const globalErrorHandler = (error, req, res, next) => {
  console.error(error);
  res.status(error.statusCode || 500).json({
    message: `Internal Server Error`,
    error: error,
  });
};

module.exports = { errorHandler, globalErrorHandler };
