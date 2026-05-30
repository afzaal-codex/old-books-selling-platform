export const adminProtect = async (
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
      message: error.message,
    });
  }
};