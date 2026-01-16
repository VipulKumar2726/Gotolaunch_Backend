const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// Import routes
const authRoutes = require("./routes/authRoutes");
const launchRoutes = require("./routes/launchRoutes");

// Import middleware
const { protect } = require("./middleware/auth");

app.use(cors());
app.use(express.json());
app.use(cookieParser()); // Parse cookies

app.get("/", (req, res) => {
  res.send("API is running ");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/launch", protect, launchRoutes); // Launch routes require authentication

module.exports = app;


