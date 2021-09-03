const insertDocument = async (db, document, collection) => {
  const coll = await db.collection(collection);
  try {
    console.log("Inserting document...");
    const result = await coll.insertOne(document);
    console.log(`Inserted: ${result.acknowledged ? "OK" : "NO"}`);
    console.log(`In collection ${collection}`);
  } catch (error) {
    console.error(`Something went wrong: ${error}`);
  }
};

const findDocuments = async (db, collection) => {
  console.log(`Looking for documents in ${collection}...`);
  const coll = await db.collection(collection);
  const docs = await coll.find({}).toArray();
  console.log("Search finished!");
  console.log('Found:\n');
  console.log(docs);
  return docs;
};

const removeDocument = async (db, document, collection) => {
  const coll = await db.collection(collection);
  try {
    console.log("Removing document...");
    await coll.deleteOne(document);
    console.log("Document removed!");
  } catch (error) {
    console.error(`Something went wrong: ${error}`);
  }
};

const updateDocument = async (db, document, update, collection) => {
  const coll = await db.collection(collection);
  try {
    console.log("Updating document...");
    await coll.updateOne(document, { $set: update });
    console.log("Updated the document with:");
    console.log(document);
  } catch (error) {
    console.error(`Something went wrong: ${error}`);
  }
};


exports.insertDocument = insertDocument;

exports.findDocuments = findDocuments;

exports.removeDocument = removeDocument;

exports.updateDocument = updateDocument;