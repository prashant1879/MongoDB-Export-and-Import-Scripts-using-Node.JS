const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const fs = require("fs");
const { ObjectId } = require('mongodb');

mongoose.connect(process.env.DB_URL, { dbName: process.env.EXPORT_DB_NAME });

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async function () {
  console.log("Connected to MongoDB");

  try {
    // Get all collection names
    let collections = await db.db.listCollections().toArray();
    let exportDir = `./${process.env.DB_FOLDER_NAME}`;
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir);
    }

    // collections = collections.slice(collections.length - 1);

    for (let collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      console.log(`Exporting collection: ${collectionName}`);

      // Fetch all documents from the collection
      const collectionData = await db.collection(collectionName).find({}).toArray();

      // Function to transform ObjectIDs
      const transformObjectIds = (doc) => {
        if (Array.isArray(doc)) {
          return doc.map(item => transformObjectIds(item));
        } else if (doc && typeof doc === 'object') {
          for (let key in doc) {
            if (ObjectId.isValid(doc[key])) {
              doc[key] = { "$oid": doc[key] };
            } else {
              doc[key] = transformObjectIds(doc[key]);
            }
          }
        }
        return doc;
      };

      // Transform data to replace ObjectIDs
      const transformedData = collectionData.map(doc => transformObjectIds(doc));

      // Convert data to JSON string
      const jsonData = JSON.stringify(transformedData, null, 2);

      // Write data to a JSON file
      fs.writeFileSync(
        `${exportDir}/${collectionName}.json`,
        jsonData
      );

      console.log(
        `Exported ${collectionData.length} documents from collection: ${collectionName}\n---------\n`
      );
    }

    console.log("Export completed.");
  } catch (error) {
    console.error("Error exporting collections:", error);
  } finally {
    mongoose.connection.close();
  }
});
