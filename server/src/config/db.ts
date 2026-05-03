import mongoose from 'mongoose';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 3000;

let memoryServer: any = null;

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;

  // Check if URI is a placeholder or missing
  const isPlaceholder = !uri
    || uri.includes('user:password@cluster')
    || uri === 'mongodb+srv://user:password@cluster.mongodb.net';

  if (!isPlaceholder) {
    // Try connecting to the real MongoDB
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        await mongoose.connect(uri, {
          dbName: process.env.MONGODB_DB_NAME || 'spark',
          maxPoolSize: 10,
          minPoolSize: 2,
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
          retryWrites: true,
        });
        console.log(`MongoDB connected successfully (attempt ${attempt})`);

        mongoose.connection.on('error', (err) => {
          console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
          console.warn('MongoDB disconnected. Attempting reconnection...');
        });

        return;
      } catch (error) {
        console.error(`MongoDB connection attempt ${attempt}/${MAX_RETRIES} failed:`, error instanceof Error ? error.message : error);
        if (attempt < MAX_RETRIES) {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
        }
      }
    }
    console.warn('Could not connect to MongoDB Atlas. Falling back to in-memory database...');
  } else {
    console.warn('MONGODB_URI is a placeholder. Using in-memory database for development...');
  }

  // Fallback: use in-memory MongoDB for development
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    const memUri = memoryServer.getUri();

    await mongoose.connect(memUri, {
      dbName: process.env.MONGODB_DB_NAME || 'spark',
    });

    console.log('In-memory MongoDB connected successfully');
    console.log('NOTE: Data will not persist between server restarts.');
    console.log('Set a real MONGODB_URI in .env for persistent storage.');
  } catch (memError) {
    console.error('Failed to start in-memory MongoDB:', memError);
    throw new Error('Could not connect to any MongoDB instance');
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
};
