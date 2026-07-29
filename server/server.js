import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";
import seedAdmin from "./seed/adminSeed.js";

const PORT = process.env.PORT || 5000;

/**
 * Start the server:
 * 1. Connect to MongoDB
 * 2. Seed default admin user
 * 3. Listen on PORT
 */
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Seed default admin user
    await seedAdmin();

    // Start listening
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
      console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  process.exit(1);
});

startServer();
