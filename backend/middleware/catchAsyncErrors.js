// backend/middleware/catchAsyncErrors.js

/**
 * Higher-Order Function (HOF) to wrap asynchronous controller functions.
 * This simplifies error handling by catching exceptions and passing them
 * to the Express global error handler (`errorMiddleware`).
 *
 * @param {function} func - The controller function to be executed.
 * @returns {function} A function that takes Express's (req, res, next) arguments.
 */
const catchAsyncErrors = (func) => (req, res, next) => {
    // Promise.resolve ensures the result of 'func' is treated as a Promise.
    // The .catch(next) automatically forwards any thrown error or rejection
    // to the next middleware in the stack (which is our errorMiddleware).
    Promise.resolve(func(req, res, next)).catch(next);
};

module.exports = catchAsyncErrors;