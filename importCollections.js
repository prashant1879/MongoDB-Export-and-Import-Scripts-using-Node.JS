const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const { ObjectId } = require('mongodb');

// Replace with your MongoDB connection string
mongoose.connect(process.env.DB_URL, { dbName: process.env.IMPORT_DB_NAME });

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async function () {
  console.log("Connected to MongoDB");
  let emptyCollection = "";
  try {
    // Path to the directory containing JSON files
    const dirPath = path.join(__dirname, process.env.DB_FOLDER_NAME);
    const files = fs.readdirSync(dirPath);

    // Function to transform $oid to ObjectId
    const transformObjectIds = (doc) => {
      if (Array.isArray(doc)) {
        return doc.map(item => transformObjectIds(item));
      } else if (doc && typeof doc === 'object') {
        for (let key in doc) {
          if (doc[key] && typeof doc[key] === 'object' && '$oid' in doc[key]) {
            doc[key] = new ObjectId(doc[key].$oid);
          } else {
            doc[key] = transformObjectIds(doc[key]);
          }
        }
      }
      return doc;
    };

    for (let file of files) {
      const collectionName = path.basename(file, ".json");
      console.log(`Importing data into collection: ${collectionName}`);

      // Read the JSON file
      const filePath = path.join(dirPath, file);
      const data = fs.readFileSync(filePath, "utf8");
      const jsonData = JSON.parse(data);

      // Transform data to replace $oid with ObjectId
      const transformedData = transformObjectIds(jsonData);

      // Insert non empty data
      if (transformedData.length != 0) {
        // Insert data into the collection
        const collection = db.collection(collectionName);
        await collection.insertMany(transformedData);
        console.log(
          `Imported ${transformedData.length} documents into collection: ${collectionName}`
        );
      } else {
        emptyCollection += `\n ${collectionName} \n`;
      }
    }

    console.log("Import completed.");

    if (emptyCollection != "") {
      console.log(`\n------\n Empty Collections \n ${emptyCollection}`);
    }
  } catch (error) {
    console.error("Error importing collections:", error);
  } finally {
    mongoose.connection.close();
  }
});
