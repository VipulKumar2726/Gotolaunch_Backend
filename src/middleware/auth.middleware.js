const jwt = require("jsonwebtoken");

// Middleware to protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in cookies or Authorization header
    if (req.cookies && req.cookies.authToken) {
      token = req.cookies.authToken;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Make sure token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this route",
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
      req.user = { id: decoded.id };
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error during authentication",
      error: error.message,
    });
  }
};

// Optional: Middleware to check if user is paid
exports.checkPaid = async (req, res, next) => {
  try {
    const User = require("../models/User");
    const user = await User.findById(req.user.id);

    if (!user || user.plan !== "paid") {
      return res.status(403).json({
        success: false,
        message: "This feature requires a paid plan",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error checking user plan",
      error: error.message,
    });
  }
};
