const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("👉 Trying to connect MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Error:", error.message);
    console.log("⚠️  Continuing without database connection...");
  }
};

module.exports = connectDB;
