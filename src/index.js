import connectDB from './db/index.js';
import dotevn from 'dotenv';
dotevn.config();
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB(); // Ensure DB connection is successful before starting the server
  } catch (error) {
    console.error(`Error connecting to the database: ${error.message}`);
    process.exit(1); // Optional: Exit the process if DB connection fails
  }
}

startServer();
