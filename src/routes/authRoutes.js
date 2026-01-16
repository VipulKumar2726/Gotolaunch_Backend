const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
} = require("../controllers/authController");

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes (will add middleware later)
router.post("/logout", logout);
router.get("/me", getMe);

module.exports = router;
