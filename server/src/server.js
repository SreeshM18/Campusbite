import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

const server = app.listen(PORT, () => {
  console.log(`
  ======================================================
  🍱 CampusBite MERN REST Backend Server Running
  📡 Mode: ${process.env.NODE_ENV || 'development'}
  🔗 Port: http://localhost:${PORT}
  🛠️  Health: http://localhost:${PORT}/api/health
  ======================================================
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Server Rejection]: ${err.message}`);
  // Close server & exit process if fatal
});
