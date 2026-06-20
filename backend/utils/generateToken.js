import jwt from "jsonwebtoken";

// Generates a signed JWT containing the user's ID
// Used during login/registration to issue an auth token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "30d",
  });
};

export default generateToken;