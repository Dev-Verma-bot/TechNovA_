const ApiError = require("../Utils/ApiError");

module.exports = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return next(new ApiError(401, "Unauthorized"));
      }

      if (!allowedRoles.includes(req.user.role)) {
        return next(new ApiError(403, "Forbidden: insufficient permissions"));
      }

      next();
    } catch (error) {
      next(new ApiError(403, "Forbidden"));
    }
  };
};
