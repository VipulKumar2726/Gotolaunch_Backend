const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// Import routes
const authRoutes = require("./routes/authRoutes");
const launchRoutes = require("./routes/launchRoutes");
const checklistRoutes = require("./routes/checklistRoutes");
const reminderRoutes = require("./routes/reminderRoutes");

// Import middleware
const { protect } = require("./middleware/auth.middleware");

// Import cron service
const { initReminderCron } = require("./services/cron.service");

app.use(cors());
app.use(express.json());
app.use(cookieParser()); // Parse cookies

// Initialize cron job for reminders
initReminderCron();

app.get("/", (req, res) => {
  res.send("API is running ");
});

app.use(require("./middleware/error.middleware"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/launch", protect, launchRoutes); // Launch routes require authentication
app.use("/api/checklist", protect, checklistRoutes); // Checklist routes require authentication
app.use("/api/reminder", protect, reminderRoutes); // Reminder routes require authentication

module.exports = app;


