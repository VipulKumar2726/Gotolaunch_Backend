const dotenv = require("dotenv");
dotenv.config();

console.log("👉 Server file loaded");

const app = require("./src/app");
const connectDB = require("./src/config/db");

console.log("👉 Before DB connection");

const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
