const Launch = require("../models/Launch");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const checklistService = require("./checklist.service");
const { ALLOW_FREE_LAUNCHES, FREE_LAUNCH_LIMIT } = require("../config/feature");

class LaunchService {
  // Create Launch
  static async createLaunch(userId, data) {
    const { productName, productUrl, launchDate, timezone } = data;

    if (!productName || !productUrl || !launchDate) {
      throw new AppError(
        "productName, productUrl and launchDate are required",
        400
      );
    }

    // Check user
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Business rule: Paid users only
    // if (user.plan !== "paid") {
    //   throw new AppError("Only paid users can create launches", 403);
    // }


    // 🧠 Check plan + feature flag
if (user.plan !== "paid") {
  if (!ALLOW_FREE_LAUNCHES) {
    throw new AppError("Only paid users can create launches", 403);
  }

  // ✅ Free users allowed → check limit
  const launchCount = await Launch.countDocuments({ userId });

  if (launchCount >= FREE_LAUNCH_LIMIT) {
    throw new AppError(
      `Free users can only create ${FREE_LAUNCH_LIMIT} launches. Upgrade to paid.`,
      403
    );
  }
}

    const launch = await Launch.create({
      userId,
      productName,
      productUrl,
      launchDate,
      timezone: timezone || user.timezone || "UTC",
      status: "upcoming",
    });

    console.log("🚀 Launch created with ID:", launch._id);

    // Auto-generate checklist for this launch
    try {
      await checklistService.autoGenerateChecklist(launch._id, launchDate);
    } catch (error) {
      console.error("Failed to auto-generate checklist:", error);
      // Don't throw error - launch was created successfully
    }

    return launch;
  }

  // Get all launches of user
  static async getAllLaunches(userId) {
    return await Launch.find({ userId }).sort({ createdAt: -1 });
  }

  // Get single launch (ownership check)
  static async getLaunchById(userId, launchId) {
    const launch = await Launch.findById(launchId);

    if (!launch) {
      throw new AppError("Launch not found", 404);
    }

    if (launch.userId.toString() !== userId) {
      throw new AppError("Not authorized to access this launch", 403);
    }

    return launch;
  }

  // Delete launch
  static async deleteLaunch(userId, launchId) {
    const launch = await Launch.findById(launchId);

    if (!launch) {
      throw new AppError("Launch not found", 404);
    }

    if (launch.userId.toString() !== userId) {
      throw new AppError("Not authorized to delete this launch", 403);
    }

    await launch.deleteOne();
    return true;
  }
}

module.exports = LaunchService;
