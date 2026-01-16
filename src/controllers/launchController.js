const Launch = require("../models/Launch");
const User = require("../models/User");

// @desc    Create a new launch
// @route   POST /api/launch/create
// @access  Private
exports.createLaunch = async (req, res) => {
  try {
    const { productName, productUrl, launchDate, timezone } = req.body;
    const userId = req.user.id; // Assuming middleware sets req.user

    // Validate inputs
    if (!productName || !productUrl || !launchDate) {
      return res.status(400).json({
        success: false,
        message: "Please provide productName, productUrl, and launchDate",
      });
    }

    // Check if user exists and is paid
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user is paid or not
    if (user.plan !== "paid") {
      return res.status(403).json({
        success: false,
        message: "Only paid users can create launches",
        plan: user.plan,
        upgrade: "Please upgrade to paid plan to create launches",
      });
    }

    // Create launch
    const launch = await Launch.create({
      userId,
      productName,
      productUrl,
      launchDate,
      timezone: timezone || user.timezone || "UTC",
      status: "upcoming",
    });
console.log("Launch created:", launch);
    // TODO: Auto-generate checklist (Next Flow)
    // This will be implemented in the checklist controller

    res.status(201).json({
      success: true,
      message: "Launch created successfully",
      launch: {
        id: launch._id,
        productName: launch.productName,
        productUrl: launch.productUrl,
        launchDate: launch.launchDate,
        timezone: launch.timezone,
        status: launch.status,
        createdAt: launch.createdAt,
      },
    });
  } catch (error) {
    console.error("Create launch error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating launch",
      error: error.message,
    });
  }
};

// @desc    Get all launches for a user
// @route   GET /api/launch/all
// @access  Private
exports.getAllLaunches = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all launches for the user, sorted by creation date
    const launches = await Launch.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: launches.length,
      launches: launches.map((launch) => ({
        id: launch._id,
        productName: launch.productName,
        productUrl: launch.productUrl,
        launchDate: launch.launchDate,
        timezone: launch.timezone,
        status: launch.status,
        createdAt: launch.createdAt,
      })),
    });
  } catch (error) {
    console.error("Get launches error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching launches",
      error: error.message,
    });
  }
};

// @desc    Get a single launch by ID
// @route   GET /api/launch/:id
// @access  Private
exports.getLaunch = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Get launch
    const launch = await Launch.findById(id);

    if (!launch) {
      return res.status(404).json({
        success: false,
        message: "Launch not found",
      });
    }

    // Check if user owns this launch
    if (launch.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this launch",
      });
    }

    res.status(200).json({
      success: true,
      launch: {
        id: launch._id,
        productName: launch.productName,
        productUrl: launch.productUrl,
        launchDate: launch.launchDate,
        timezone: launch.timezone,
        status: launch.status,
        createdAt: launch.createdAt,
      },
    });
  } catch (error) {
    console.error("Get launch error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching launch",
      error: error.message,
    });
  }
};

// @desc    Delete a launch
// @route   DELETE /api/launch/:id
// @access  Private
exports.deleteLaunch = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Get launch
    const launch = await Launch.findById(id);

    if (!launch) {
      return res.status(404).json({
        success: false,
        message: "Launch not found",
      });
    }

    // Check if user owns this launch
    if (launch.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this launch",
      });
    }

    // Delete launch
    await Launch.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Launch deleted successfully",
    });
  } catch (error) {
    console.error("Delete launch error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting launch",
      error: error.message,
    });
  }
};
