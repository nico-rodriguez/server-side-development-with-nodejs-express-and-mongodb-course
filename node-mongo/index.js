const MongoClient = require('mongodb').MongoClient;
const dbOps = require('./operations');

const URL = 'mongodb://localhost:27017/';
const DB_NAME = 'conFusion';

const client = new MongoClient(URL);

(async () => {
  try {
    console.log("Connecting to database...");
    await client.connect();
    const db = await client.db(DB_NAME);
    console.log('Connected to database!\n');

    await dbOps.insertDocument(db, {'name' : 'Uthapizza', 'description' : 'test'}, 'dishes');

    await dbOps.findDocuments(db, 'dishes');

    dbOps.updateDocument(db, {name: 'Uthapizza'}, {description : 'Updated test'}, 'dishes');

    await dbOps.findDocuments(db, 'dishes');

    console.log("Dropping 'dishes' collection...\n");
    await db.dropCollection('dishes');
    console.log("'dishes' collection dropped!");
  } catch (error) {
    console.error(`Something went wrong: ${error}`);
  } finally {
    console.log("Closing connection to database...");
    await client.close();
    console.log("Connection closed!");
  }
})();
