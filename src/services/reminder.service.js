const Reminder = require("../models/Reminder");
const User = require("../models/User");
const Launch = require("../models/Launch");
const nodemailer = require("nodemailer");

// Configure email transporter
const emailTransporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Create a reminder for a checklist item
 * @param {String} userId - User ID
 * @param {String} launchId - Launch ID
 * @param {String} checklistId - Checklist item ID
 * @param {String} message - Reminder message
 * @param {Date} sendAt - When to send the reminder
 * @returns {Promise<Object>} - Created reminder
 */
exports.createReminder = async (userId, launchId, checklistId, message, sendAt) => {
  try {
    const reminder = await Reminder.create({
      userId,
      launchId,
      checklistId,
      message,
      sendAt,
      sent: false,
    });

    console.log(`📬 Reminder created for ${new Date(sendAt).toLocaleString()}`);
    return reminder;
  } catch (error) {
    console.error("Error creating reminder:", error);
    throw error;
  }
};

/**
 * Get all pending reminders (not yet sent)
 * @returns {Promise<Array>} - Pending reminders
 */
exports.getPendingReminders = async () => {
  try {
    const reminders = await Reminder.find({
      sent: false,
      sendAt: { $lte: new Date() }, // sendAt <= now
    }).populate("userId", "email name");

    return reminders;
  } catch (error) {
    console.error("Error getting pending reminders:", error);
    throw error;
  }
};

/**
 * Send email reminder
 * @param {String} userEmail - Recipient email
 * @param {String} userName - Recipient name
 * @param {String} message - Reminder message
 * @param {String} launchId - Launch ID for context
 * @returns {Promise<boolean>} - Success status
 */
exports.sendEmailReminder = async (userEmail, userName, message, launchId) => {
  try {
    // Skip if email credentials not configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log(`⚠️  Email not configured. Would send to ${userEmail}: ${message}`);
      return true;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `🚀 GoToLaunch Reminder - Launch Checklist Update`,
      html: `
        <h2>Hi ${userName},</h2>
        <p>This is a reminder for your GoToLaunch:</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>${message}</strong></p>
        </div>
        <p>
          <a href="${process.env.APP_URL || "http://localhost:3000"}/launches/${launchId}" 
             style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            View Your Launch
          </a>
        </p>
        <hr>
        <p style="color: #666; font-size: 12px;">GoToLaunch - Product Launch Checklist</p>
      `,
    };

    await emailTransporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${userEmail}`);
    return true;
  } catch (error) {
    console.error(`Error sending email to ${userEmail}:`, error);
    return false;
  }
};

/**
 * Process and send all pending reminders
 * Called by cron job every 5 minutes
 * @returns {Promise<Object>} - Statistics
 */
exports.processPendingReminders = async () => {
  try {
    const pendingReminders = await this.getPendingReminders();

    if (pendingReminders.length === 0) {
      console.log("📭 No pending reminders");
      return { sent: 0, failed: 0 };
    }

    console.log(`⏰ Found ${pendingReminders.length} pending reminders`);

    let sent = 0;
    let failed = 0;

    for (const reminder of pendingReminders) {
      try {
        const user = reminder.userId;

        // Send email
        const emailSent = await this.sendEmailReminder(
          user.email,
          user.name,
          reminder.message,
          reminder.launchId
        );

        if (emailSent) {
          // Mark reminder as sent
          reminder.sent = true;
          reminder.sentAt = new Date();
          await reminder.save();
          sent++;
        } else {
          failed++;
        }
      } catch (error) {
        console.error(`Error processing reminder ${reminder._id}:`, error);
        failed++;
      }
    }

    console.log(`✅ Reminders processed - Sent: ${sent}, Failed: ${failed}`);
    return { sent, failed };
  } catch (error) {
    console.error("Error processing pending reminders:", error);
    return { sent: 0, failed: 0 };
  }
};

/**
 * Get all reminders for a user
 * @param {String} userId - User ID
 * @returns {Promise<Array>} - User's reminders
 */
exports.getRemindersByUserId = async (userId) => {
  try {
    const reminders = await Reminder.find({ userId }).sort({ sendAt: -1 });
    return reminders;
  } catch (error) {
    console.error("Error fetching user reminders:", error);
    throw error;
  }
};

/**
 * Get all reminders for a launch
 * @param {String} launchId - Launch ID
 * @returns {Promise<Array>} - Launch's reminders
 */
exports.getRemindersByLaunchId = async (launchId) => {
  try {
    const reminders = await Reminder.find({ launchId }).sort({ sendAt: -1 });
    return reminders;
  } catch (error) {
    console.error("Error fetching launch reminders:", error);
    throw error;
  }
};

/**
 * Delete a reminder
 * @param {String} reminderId - Reminder ID
 * @returns {Promise<boolean>} - Success status
 */
exports.deleteReminder = async (reminderId) => {
  try {
    const result = await Reminder.findByIdAndDelete(reminderId);

    if (!result) {
      throw new Error("Reminder not found");
    }

    return true;
  } catch (error) {
    console.error("Error deleting reminder:", error);
    throw error;
  }
};

/**
 * Update a reminder
 * @param {String} reminderId - Reminder ID
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} - Updated reminder
 */
exports.updateReminder = async (reminderId, updateData) => {
  try {
    const reminder = await Reminder.findByIdAndUpdate(reminderId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!reminder) {
      throw new Error("Reminder not found");
    }

    return reminder;
  } catch (error) {
    console.error("Error updating reminder:", error);
    throw error;
  }
};
