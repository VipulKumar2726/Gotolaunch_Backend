const express = require("express");
const router = express.Router();
const {
  createLaunch,
  getAllLaunches,
  getLaunch,
  deleteLaunch,
} = require("../controllers/launch.controller");

// Note: These routes require authentication middleware (will be added)
// For now, they will use req.user.id from the middleware

// POST - Create a new launch
router.post("/create", createLaunch);

// GET - Get all launches for authenticated user
router.get("/all", getAllLaunches);

// GET - Get a specific launch by ID
router.get("/:id", getLaunch);

// DELETE - Delete a launch
router.delete("/:id", deleteLaunch);

module.exports = router;
