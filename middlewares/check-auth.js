const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const util = require("util");

// const jwt_key = process.env.ACCESS_TOKEN_SECRET;

const checkAuth = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw new Error("Token Not Found");
    }
    const token = req.headers.authorization.split(" ")[1];
    const decoded = await util.promisify(jwt.verify)(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );
    const exist = await User.findById(decoded._id);
    if (!exist) {
      throw new Error("User does not exist. Token expired!");
    }
    req.userData = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
    // next(error);
  }
};

const checkAdminOrManager = function (roles) {
  return async function (req, res, next) {
    try {
      if (!roles.includes(req.userData.role)) {
        throw new Error("Permission denied!");
      }
      next();
    } catch (error) {
      res.status(401).json({
        message: error.message,
      });
    }
  };
};

module.exports = { checkAuth, checkAdminOrManager };