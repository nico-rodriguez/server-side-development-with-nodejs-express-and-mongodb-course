const MongoClient = require('mongodb').MongoClient;


const URL = 'mongodb://localhost:27017/';
const DB_NAME = 'conFusion';

const client = new MongoClient(URL);

(async () => {
  try {
    console.log("Connecting to database...");
    await client.connect();
    console.log('Connected to database!\n');

    const db = await client.db(DB_NAME);
    console.log("Retrieving dishes...");
    const collection = await db.collection('dishes');

    console.log("Inserting document...");
    const result = await collection.insertOne({'name' : 'Uthapizza', 'description' : 'test'});
    console.log(`Inserted: ${result.acknowledged ? "OK" : "NO"}`);
    result.acknowledged && console.log(`Id: ${result.insertedId}`);
    console.log("\n");

    console.log("Looking for documents in 'dishes' collection...");
    const docs = await collection.find().toArray();
    console.log('Found:\n');
    console.log(docs);
    console.log("\n");

    console.log("Dropping 'dishes' collection...\n");
    await db.dropCollection('dishes');
  } catch (error) {
    console.error(`Something went wrong: ${error}`);
  } finally {
    console.log("Closing connection to database...");
    await client.close();
    console.log("Connection closed!");
  }
})();
