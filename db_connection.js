const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017";
const dbName = "university_db";

let client;
let db;

async function connectDB() {
  if (!db) {
    client = new MongoClient(url);
    await client.connect();
    db = client.db(dbName);
    console.log(" Connected to MongoDB");
  }
  return db;
}

async function closeDB() {
  if (client) {
    await client.close();
    console.log("MongoDB connection closed");
  }
}

module.exports = { connectDB, closeDB };
