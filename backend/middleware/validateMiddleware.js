import { validationResult } from "express-validator";

// Runs after express-validator's check() chains in route definitions
// Collects errors and returns a 400 response if any validation failed
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400);
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

export default validate;