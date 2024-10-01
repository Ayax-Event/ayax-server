import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGO_URI;
console.log(uri, "<<<<<<< URI");

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
const database = client.db("ayax-event_db");

export default database;
