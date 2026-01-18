const reminderService = require("../services/reminder.service");
const Launch = require("../models/Launch");
const Reminder = require("../models/Reminder");

// @desc    Get all reminders for a user
// @route   GET /api/reminder/user
// @access  Private
exports.getUserReminders = async (req, res) => {
  try {
    const userId = req.user.id;

    const reminders = await reminderService.getRemindersByUserId(userId);

    res.status(200).json({
      success: true,
      count: reminders.length,
      reminders: reminders.map((reminder) => ({
        id: reminder._id,
        launchId: reminder.launchId,
        checklistId: reminder.checklistId,
        message: reminder.message,
        sendAt: reminder.sendAt,
        sent: reminder.sent,
        sentAt: reminder.sentAt,
        createdAt: reminder.createdAt,
      })),
    });
  } catch (error) {
    console.error("Get user reminders error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching reminders",
      error: error.message,
    });
  }
};

// @desc    Get all reminders for a launch
// @route   GET /api/reminder/launch/:launchId
// @access  Private
exports.getLaunchReminders = async (req, res) => {
  try {
    const { launchId } = req.params;
    const userId = req.user.id;

    // Verify launch exists and user owns it
    const launch = await Launch.findById(launchId);

    if (!launch) {
      return res.status(404).json({
        success: false,
        message: "Launch not found",
      });
    }

    if (launch.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this launch's reminders",
      });
    }

    const reminders = await reminderService.getRemindersByLaunchId(launchId);

    res.status(200).json({
      success: true,
      launchId,
      count: reminders.length,
      reminders: reminders.map((reminder) => ({
        id: reminder._id,
        message: reminder.message,
        sendAt: reminder.sendAt,
        sent: reminder.sent,
        sentAt: reminder.sentAt,
        createdAt: reminder.createdAt,
      })),
    });
  } catch (error) {
    console.error("Get launch reminders error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching reminders",
      error: error.message,
    });
  }
};

// @desc    Delete a reminder
// @route   DELETE /api/reminder/:id
// @access  Private
exports.deleteReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Get reminder
    const reminder = await Reminder.findById(id);

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: "Reminder not found",
      });
    }

    // Verify user owns this reminder
    if (reminder.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this reminder",
      });
    }

    // Delete reminder
    await reminderService.deleteReminder(id);

    res.status(200).json({
      success: true,
      message: "Reminder deleted successfully",
    });
  } catch (error) {
    console.error("Delete reminder error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting reminder",
      error: error.message,
    });
  }
};

// @desc    Manually send pending reminders (for testing)
// @route   POST /api/reminder/send-pending
// @access  Private (Admin only ideally)
exports.sendPendingReminders = async (req, res) => {
  try {
    const stats = await reminderService.processPendingReminders();

    res.status(200).json({
      success: true,
      message: "Pending reminders processing completed",
      stats,
    });
  } catch (error) {
    console.error("Send pending reminders error:", error);
    res.status(500).json({
      success: false,
      message: "Error processing reminders",
      error: error.message,
    });
  }
};

// @desc    Get pending reminders count
// @route   GET /api/reminder/pending-count
// @access  Private
exports.getPendingCount = async (req, res) => {
  try {
    const reminders = await reminderService.getPendingReminders();

    res.status(200).json({
      success: true,
      pendingCount: reminders.length,
      reminders: reminders.map((r) => ({
        id: r._id,
        message: r.message,
        sendAt: r.sendAt,
      })),
    });
  } catch (error) {
    console.error("Get pending count error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching pending count",
      error: error.message,
    });
  }
};
