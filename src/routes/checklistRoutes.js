const express = require("express");
const router = express.Router();
const {
  getChecklistByLaunch,
  toggleChecklistItem,
  createCustomChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
  getChecklistStats,
} = require("../controllers/checklistController");

// GET - Get all checklist items for a launch
router.get("/:launchId", getChecklistByLaunch);

// GET - Get checklist statistics
router.get("/:launchId/stats", getChecklistStats);

// POST - Create custom checklist item
router.post("/custom", createCustomChecklistItem);

// PUT - Toggle checklist item completion status
router.put("/:id/toggle", toggleChecklistItem);

// PUT - Update checklist item
router.put("/:id", updateChecklistItem);

// DELETE - Delete checklist item
router.delete("/:id", deleteChecklistItem);

module.exports = router;
