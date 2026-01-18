const checklistService = require("../services/checklist.service");
const Launch = require("../models/Launch");
const Checklist = require("../models/Checklist");

// @desc    Get all checklist items for a launch
// @route   GET /api/checklist/:launchId
// @access  Private
exports.getChecklistByLaunch = async (req, res) => {
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
        message: "Not authorized to access this launch's checklist",
      });
    }

    // Get all checklist items
    const checklists = await checklistService.getChecklistByLaunchId(launchId);

    // Get statistics
    const stats = await checklistService.getChecklistStats(launchId);

    res.status(200).json({
      success: true,
      launchId,
      stats,
      checklists: checklists.map((item) => ({
        id: item._id,
        title: item.title,
        description: item.description,
        dueDate: item.dueDate,
        category: item.category,
        completed: item.completed,
        createdAt: item.createdAt,
      })),
    });
  } catch (error) {
    console.error("Get checklist error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching checklist",
      error: error.message,
    });
  }
};

// @desc    Toggle completion status of a checklist item
// @route   PUT /api/checklist/:id/toggle
// @access  Private
exports.toggleChecklistItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Get checklist item
    const checklistItem = await Checklist.findById(id);

    if (!checklistItem) {
      return res.status(404).json({
        success: false,
        message: "Checklist item not found",
      });
    }

    // Verify launch exists and user owns it
    const launch = await Launch.findById(checklistItem.launchId);

    if (!launch) {
      return res.status(404).json({
        success: false,
        message: "Associated launch not found",
      });
    }

    if (launch.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to modify this checklist item",
      });
    }

    // Toggle the item
    const updated = await checklistService.toggleChecklistItem(id);

    res.status(200).json({
      success: true,
      message: `Checklist item marked as ${updated.completed ? "completed" : "pending"}`,
      checklist: {
        id: updated._id,
        title: updated.title,
        description: updated.description,
        dueDate: updated.dueDate,
        category: updated.category,
        completed: updated.completed,
      },
    });
  } catch (error) {
    console.error("Toggle checklist error:", error);
    res.status(500).json({
      success: false,
      message: "Error toggling checklist item",
      error: error.message,
    });
  }
};

// @desc    Create custom checklist item
// @route   POST /api/checklist/custom
// @access  Private
exports.createCustomChecklistItem = async (req, res) => {
  try {
    const { launchId, title, description, dueDate, category } = req.body;
    const userId = req.user.id;

    // Validate inputs
    if (!launchId || !title || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "Please provide launchId, title, and dueDate",
      });
    }

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
        message: "Not authorized to add checklist items to this launch",
      });
    }

    // Create custom checklist item
    const checklist = await checklistService.createCustomChecklistItem({
      launchId,
      title,
      description,
      dueDate,
      category: category || "pre",
    });

    res.status(201).json({
      success: true,
      message: "Custom checklist item created successfully",
      checklist: {
        id: checklist._id,
        title: checklist.title,
        description: checklist.description,
        dueDate: checklist.dueDate,
        category: checklist.category,
        completed: checklist.completed,
        createdAt: checklist.createdAt,
      },
    });
  } catch (error) {
    console.error("Create custom checklist error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating custom checklist item",
      error: error.message,
    });
  }
};

// @desc    Update checklist item
// @route   PUT /api/checklist/:id
// @access  Private
exports.updateChecklistItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, category, completed } = req.body;
    const userId = req.user.id;

    // Get checklist item
    const checklistItem = await Checklist.findById(id);

    if (!checklistItem) {
      return res.status(404).json({
        success: false,
        message: "Checklist item not found",
      });
    }

    // Verify launch exists and user owns it
    const launch = await Launch.findById(checklistItem.launchId);

    if (!launch) {
      return res.status(404).json({
        success: false,
        message: "Associated launch not found",
      });
    }

    if (launch.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to modify this checklist item",
      });
    }

    // Update item
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (dueDate) updateData.dueDate = dueDate;
    if (category) updateData.category = category;
    if (completed !== undefined) updateData.completed = completed;

    const updated = await checklistService.updateChecklistItem(id, updateData);

    res.status(200).json({
      success: true,
      message: "Checklist item updated successfully",
      checklist: {
        id: updated._id,
        title: updated.title,
        description: updated.description,
        dueDate: updated.dueDate,
        category: updated.category,
        completed: updated.completed,
      },
    });
  } catch (error) {
    console.error("Update checklist error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating checklist item",
      error: error.message,
    });
  }
};

// @desc    Delete checklist item
// @route   DELETE /api/checklist/:id
// @access  Private
exports.deleteChecklistItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Get checklist item
    const checklistItem = await Checklist.findById(id);

    if (!checklistItem) {
      return res.status(404).json({
        success: false,
        message: "Checklist item not found",
      });
    }

    // Verify launch exists and user owns it
    const launch = await Launch.findById(checklistItem.launchId);

    if (!launch) {
      return res.status(404).json({
        success: false,
        message: "Associated launch not found",
      });
    }

    if (launch.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this checklist item",
      });
    }

    // Delete item
    await checklistService.deleteChecklistItem(id);

    res.status(200).json({
      success: true,
      message: "Checklist item deleted successfully",
    });
  } catch (error) {
    console.error("Delete checklist error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting checklist item",
      error: error.message,
    });
  }
};

// @desc    Get checklist statistics
// @route   GET /api/checklist/:launchId/stats
// @access  Private
exports.getChecklistStats = async (req, res) => {
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
        message: "Not authorized to access this launch's statistics",
      });
    }

    // Get statistics
    const stats = await checklistService.getChecklistStats(launchId);

    res.status(200).json({
      success: true,
      launchId,
      stats,
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching statistics",
      error: error.message,
    });
  }
};
