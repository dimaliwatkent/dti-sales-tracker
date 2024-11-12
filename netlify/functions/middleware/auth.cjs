const jwt = require("jsonwebtoken");

const generateAccessToken = async ({ id }) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "20h" });
};

const generateRefreshToken = async ({ id, email }) => {
  return jwt.sign({ id, email }, process.env.JWT_SECRET);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
