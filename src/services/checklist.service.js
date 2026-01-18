const Checklist = require("../models/Checklist");
const reminderService = require("./reminder.service");
const Launch = require("../models/Launch");

// Hardcoded checklist template with relative dates
// Format: { daysBeforeLaunch, title, description, category }
const CHECKLIST_TEMPLATE = [
  {
    daysBeforeLaunch: -30,
    title: "Prepare PH page",
    description: "Create and set up your Product Hunt page with compelling copy, visuals, and description",
    category: "pre",
  },
  {
    daysBeforeLaunch: -21,
    title: "Hunter outreach",
    description: "Reach out to Product Hunt hunters to get early support and feedback",
    category: "pre",
  },
  {
    daysBeforeLaunch: -14,
    title: "Teaser content",
    description: "Create and schedule teaser content on social media to build anticipation",
    category: "pre",
  },
  {
    daysBeforeLaunch: -7,
    title: "Email draft",
    description: "Draft and prepare email announcement for your mailing list",
    category: "pre",
  },
  {
    daysBeforeLaunch: 0,
    title: "Launch live checklist",
    description: "Final checks before going live - ensure all systems are ready",
    category: "launch",
  },
  {
    daysBeforeLaunch: 1,
    title: "Thank you post",
    description: "Post thank you message and engage with early supporters and feedback",
    category: "post",
  },
];

/**
 * Auto-generate checklist items for a launch
 * @param {String} launchId - Launch ID
 * @param {Date} launchDate - Launch date
 * @returns {Promise<Array>} - Created checklist items
 */
exports.autoGenerateChecklist = async (launchId, launchDate) => {
  try {
    const checklistItems = [];

    // Generate checklist items based on template
    for (const item of CHECKLIST_TEMPLATE) {
      // Calculate due date: launchDate + daysBeforeLaunch
      const dueDate = new Date(launchDate);
      dueDate.setDate(dueDate.getDate() + item.daysBeforeLaunch);

      const checklistItem = {
        launchId,
        title: item.title,
        description: item.description,
        dueDate,
        category: item.category,
        completed: false,
      };

      checklistItems.push(checklistItem);
    }

    // Bulk create all checklist items
    const createdItems = await Checklist.insertMany(checklistItems);

    console.log(`✅ Auto-generated ${createdItems.length} checklist items for launch ${launchId}`);

    // Auto-create reminders for each checklist item
    try {
      const launch = await Launch.findById(launchId);
      if (launch) {
        for (const item of createdItems) {
          // Create reminder for the due date
          const reminderMessage = `⏰ Reminder: ${item.title} is due on ${item.dueDate.toLocaleDateString()}`;
          await reminderService.createReminder(
            launch.userId,
            launchId,
            item._id,
            reminderMessage,
            item.dueDate
          );
        }
        console.log(`📬 Auto-created ${createdItems.length} reminders for checklist items`);
      }
    } catch (error) {
      console.error("Error creating reminders for checklist items:", error);
      // Don't throw - checklist items were created successfully
    }

    return createdItems;
  } catch (error) {
    console.error("Error auto-generating checklist:", error);
    throw error;
  }
};

/**
 * Get all checklist items for a launch
 * @param {String} launchId - Launch ID
 * @returns {Promise<Array>} - Checklist items
 */
exports.getChecklistByLaunchId = async (launchId) => {
  try {
    const checklists = await Checklist.find({ launchId }).sort({ dueDate: 1 });
    return checklists;
  } catch (error) {
    console.error("Error fetching checklist:", error);
    throw error;
  }
};

/**
 * Get checklist item by ID
 * @param {String} checklistId - Checklist item ID
 * @returns {Promise<Object>} - Checklist item
 */
exports.getChecklistById = async (checklistId) => {
  try {
    const checklist = await Checklist.findById(checklistId);
    return checklist;
  } catch (error) {
    console.error("Error fetching checklist item:", error);
    throw error;
  }
};

/**
 * Toggle completion status of a checklist item
 * @param {String} checklistId - Checklist item ID
 * @returns {Promise<Object>} - Updated checklist item
 */
exports.toggleChecklistItem = async (checklistId) => {
  try {
    const checklist = await Checklist.findById(checklistId);

    if (!checklist) {
      throw new Error("Checklist item not found");
    }

    // Toggle completed status
    checklist.completed = !checklist.completed;
    await checklist.save();

    return checklist;
  } catch (error) {
    console.error("Error toggling checklist item:", error);
    throw error;
  }
};

/**
 * Create custom checklist item
 * @param {Object} data - { launchId, title, description, dueDate, category }
 * @returns {Promise<Object>} - Created checklist item
 */
exports.createCustomChecklistItem = async (data) => {
  try {
    const { launchId, title, description, dueDate, category } = data;

    const checklist = await Checklist.create({
      launchId,
      title,
      description,
      dueDate,
      category: category || "pre",
      completed: false,
    });

    return checklist;
  } catch (error) {
    console.error("Error creating custom checklist item:", error);
    throw error;
  }
};

/**
 * Update checklist item
 * @param {String} checklistId - Checklist item ID
 * @param {Object} updateData - Fields to update
 * @returns {Promise<Object>} - Updated checklist item
 */
exports.updateChecklistItem = async (checklistId, updateData) => {
  try {
    const checklist = await Checklist.findByIdAndUpdate(checklistId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!checklist) {
      throw new Error("Checklist item not found");
    }

    return checklist;
  } catch (error) {
    console.error("Error updating checklist item:", error);
    throw error;
  }
};

/**
 * Delete checklist item
 * @param {String} checklistId - Checklist item ID
 * @returns {Promise<boolean>} - Success status
 */
exports.deleteChecklistItem = async (checklistId) => {
  try {
    const result = await Checklist.findByIdAndDelete(checklistId);

    if (!result) {
      throw new Error("Checklist item not found");
    }

    return true;
  } catch (error) {
    console.error("Error deleting checklist item:", error);
    throw error;
  }
};

/**
 * Get checklist statistics for a launch
 * @param {String} launchId - Launch ID
 * @returns {Promise<Object>} - Statistics
 */
exports.getChecklistStats = async (launchId) => {
  try {
    const total = await Checklist.countDocuments({ launchId });
    const completed = await Checklist.countDocuments({ launchId, completed: true });
    const pending = total - completed;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      pending,
      progress: `${progress}%`,
    };
  } catch (error) {
    console.error("Error getting checklist stats:", error);
    throw error;
  }
};
