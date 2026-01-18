const cron = require("node-cron");
const reminderService = require("./reminder.service");

let cronJob = null;

/**
 * Initialize and start the reminder cron job
 * Runs every 5 minutes to send pending reminders
 */
exports.initReminderCron = () => {
  try {
    // Schedule cron job to run every 5 minutes
    // Format: minute hour day month weekday
    // */5 in minute field = every 5 minutes
    cronJob = cron.schedule("*/5 * * * *", async () => {
      console.log(`⏰ [${new Date().toISOString()}] Running reminder cron job...`);
      try {
        const stats = await reminderService.processPendingReminders();
        console.log(`✅ Cron job completed - ${stats.sent} sent, ${stats.failed} failed`);
      } catch (error) {
        console.error("❌ Error in reminder cron job:", error);
      }
    });

    console.log("✅ Reminder cron job initialized - Runs every 5 minutes");
    return cronJob;
  } catch (error) {
    console.error("Error initializing reminder cron job:", error);
    throw error;
  }
};

/**
 * Stop the cron job
 */
exports.stopReminderCron = () => {
  if (cronJob) {
    cronJob.stop();
    console.log("🛑 Reminder cron job stopped");
  }
};

/**
 * Get cron job status
 */
exports.getCronStatus = () => {
  return {
    active: cronJob !== null,
    pattern: "*/5 * * * * (every 5 minutes)",
    lastRun: cronJob ? "Check logs" : "Not started",
  };
};
