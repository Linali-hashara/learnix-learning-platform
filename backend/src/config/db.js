const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Connection pool configuration for long-running server
      maxPoolSize: 10,           // Connections for typical backend workload
      minPoolSize: 2,            // Pre-warmed connections for faster startup
      maxIdleTimeMS: 30000,      // Close idle connections after 30s
      connectTimeoutMS: 10000,   // Timeout after 10s if can't connect
      socketTimeoutMS: 45000,    // Socket timeout for operations
      serverSelectionTimeoutMS: 5000, // Quick failover on replica set changes
      // Retry logic
      retryWrites: true,
      retryReads: true,
      // Application name for monitoring
      appName: 'learnix-backend'
    });

    console.log(`✅ MongoDB connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
