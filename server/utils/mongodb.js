import 'dotenv/config';
import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = process.env.MONGODB_URI;

if (!uri) {
    throw new Error('MONGODB_URI is not set');
}

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

async function connectToMongoDB() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Successfully connected to MongoDB!");
    return client;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw error;
  }
}

function getDatabase(dbName = 'hardware_prototype') {
  return client.db(dbName);
}

async function closeConnection() {
  try {
    await client.close();
    console.log("✅ MongoDB connection closed");
  } catch (error) {
    console.error("❌ Error closing MongoDB connection:", error);
  }
}

function getCollection(collectionName) {
  const db = getDatabase();

  if (!db.collection(collectionName)) {
    db.createCollection(collectionName);
  }

  return db.collection(collectionName);
}

export {
  client,
  connectToMongoDB,
  getDatabase,
  closeConnection,
  getCollection
};