const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    //  safety check
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: user not found",
      });
    }

    // role check
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied: requires ${roles.join(", ")} role`,
      });
    }

    next();
  };
};

module.exports = roleMiddleware;