import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not defined');
}

interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let cached: CachedConnection = {
  conn: null,
  promise: null,
};

async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    console.log('[v0] Using cached MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('[v0] Creating new MongoDB connection');
    cached.promise = mongoose
      .connect(MONGODB_URI!, {
        bufferCommands: false,
        maxPoolSize: 10,
      })
      .then((mongoose) => {
        console.log('[v0] MongoDB connected successfully');
        return mongoose;
      })
      .catch((err) => {
        console.error('[v0] MongoDB connection error:', err);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
