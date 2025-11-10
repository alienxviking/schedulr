const mongoose = require('mongoose');

// We REMOVED the MONGO_URI constant from here.

const connectDB = async () => {
  // We MOVED the MONGO_URI constant INSIDE the function.
  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    console.error('MONGO_URI is not defined in .env file');
    process.exit(1); // Exit the process with failure
  }

  try {
    // Attempt to connect to the database
    const conn = await mongoose.connect(MONGO_URI, {
      // These options are to remove deprecation warnings
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit the process with failure
  }
};

module.exports = connectDB;