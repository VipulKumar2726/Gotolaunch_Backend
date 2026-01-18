const express = require("express");
const router = express.Router();
const {
  getUserReminders,
  getLaunchReminders,
  deleteReminder,
  sendPendingReminders,
  getPendingCount,
} = require("../controllers/reminderController");

// GET - Get all reminders for authenticated user
router.get("/user", getUserReminders);

// GET - Get pending reminders count
router.get("/pending-count", getPendingCount);

// GET - Get all reminders for a launch
router.get("/launch/:launchId", getLaunchReminders);

// POST - Manually trigger reminder sending (for testing)
router.post("/send-pending", sendPendingReminders);

// DELETE - Delete a reminder
router.delete("/:id", deleteReminder);

module.exports = router;
