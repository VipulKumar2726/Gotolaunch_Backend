const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user ID"],
    },
    launchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Launch",
      required: [true, "Please provide launch ID"],
    },
    checklistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Checklist",
    },
    sendAt: {
      type: Date,
      required: [true, "Please provide send date/time"],
    },
    message: {
      type: String,
      required: [true, "Please provide reminder message"],
      trim: true,
    },
    sent: {
      type: Boolean,
      default: false,
    },
    sentAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Indexes for efficient queries
reminderSchema.index({ userId: 1, sent: 1 });
reminderSchema.index({ launchId: 1, sent: 1 });
reminderSchema.index({ sendAt: 1, sent: 1 }); // For cron job to find pending reminders

module.exports = mongoose.model("Reminder", reminderSchema);
