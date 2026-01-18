const mongoose = require("mongoose");

const checklistSchema = new mongoose.Schema(
  {
    launchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Launch",
      required: [true, "Please provide launch ID"],
    },
    title: {
      type: String,
      required: [true, "Please provide checklist title"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    dueDate: {
      type: Date,
      required: [true, "Please provide due date"],
    },
    category: {
      type: String,
      enum: ["pre", "launch", "post"],
      default: "pre",
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for quick lookup
checklistSchema.index({ launchId: 1, category: 1 });
checklistSchema.index({ launchId: 1, completed: 1 });

module.exports = mongoose.model("Checklist", checklistSchema);
