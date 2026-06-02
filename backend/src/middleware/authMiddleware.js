import jwt from "jsonwebtoken";
import User from "../models/User.js";


// =========================================
// PROTECT ROUTES
// =========================================

export const protect = async (req, res, next) => {
  try {

    let token;

    // CHECK TOKEN
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token =
        req.headers.authorization.split(" ")[1];
    }

    // NO TOKEN
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    // VERIFY TOKEN
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // =========================================
    // HIDDEN ADMIN AUTH
    // =========================================

    if (decoded.isAdmin) {
      const adminUser = await User.findById(decoded.id).select("-password");
      if (adminUser) {
        req.user = adminUser;
        req.user.isAdmin = true;
        return next();
      }
    }

    // =========================================
    // NORMAL USER AUTH
    // =========================================

    const user =
      await User.findById(
        decoded.id
      ).select("-password");

    // USER NOT FOUND
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // BLOCKED USER
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message:
          "Your account has been blocked",
      });
    }

    // =========================================
    // INACTIVE USER CHECK
    // =========================================

    if (user.isInactive) {
      return res.status(403).json({
        success: false,
        message:
          "Your account is inactive due to long inactivity",
      });
    }

    // =========================================
    // UPDATE USER ACTIVITY
    // =========================================

    user.lastActiveAt =
      new Date();

    await user.save();

    req.user = user;

    next();

  } catch (error) {

    return res.status(401).json({
      success: false,
      message:
        "Invalid or expired token",
    });
  }
};


// =========================================
// ADMIN ONLY
// =========================================

export const adminOnly = async (
  req,
  res,
  next
) => {
  try {

    if (!req.user?.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    next();

  } catch (error) {

    return res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

// =========================================
// OPTIONAL AUTHENTICATION
// =========================================
export const optionalProtect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.isAdmin) {
      const adminUser = await User.findById(decoded.id).select("-password");
      if (adminUser) {
        req.user = adminUser;
        req.user.isAdmin = true;
        return next();
      }
    }

    const user = await User.findById(decoded.id).select("-password");

    if (user) {
      if (user.isBlocked) {
        return res.status(403).json({
          success: false,
          message: "Your account has been blocked",
        });
      }
      if (user.isInactive) {
        return res.status(403).json({
          success: false,
          message: "Your account is inactive due to long inactivity",
        });
      }
      user.lastActiveAt = new Date();
      await user.save();
      req.user = user;
    }
    next();
  } catch (error) {
    next();
  }
};