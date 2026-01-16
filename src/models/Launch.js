const mongoose = require("mongoose");

const launchSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user ID"],
    },
    productName: {
      type: String,
      required: [true, "Please provide product name"],
      trim: true,
    },
    productUrl: {
      type: String,
      required: [true, "Please provide product URL"],
      validate: {
        validator: function (value) {
          return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(
            value
          );
        },
        message: "Please provide a valid URL",
      },
    },
    launchDate: {
      type: Date,
      required: [true, "Please provide launch date"],
    },
    timezone: {
      type: String,
      default: "UTC",
      example: "Asia/Kolkata",
    },
    status: {
      type: String,
      enum: ["upcoming", "live", "completed"],
      default: "upcoming",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for user launches
launchSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Launch", launchSchema);
