const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const fs = require("fs");

mongoose.connect(process.env.DB_URL, {
  dbName: process.env.DROP_COLLECTION_DB_NAME,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async function () {
  console.log("Connected to MongoDB");

  try {
    // Get all collection names
    const collections = await db.db.listCollections().toArray();

    for (let collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      console.log(`Exporting collection: ${collectionName}`);

      // drop all collection
      const collections = await db.db.collection(collectionName).drop();

      console.log(`Dropped collection: ${collectionName}\n---------\n`);
    }

    console.log("Empty Database.");
  } catch (error) {
    console.error("Error Dropping collections:", error);
  } finally {
    mongoose.connection.close();
  }
});
