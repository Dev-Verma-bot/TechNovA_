const jwt = require("jsonwebtoken");
const ApiError = require("../Utils/ApiError");

module.exports = (req, res, next) => {
  try {
    const token =
      req.cookies?.token ||
      req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return next(new ApiError(401, "Unauthorized: Token missing"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    next(new ApiError(401, "Unauthorized: Invalid token"));
  }
};