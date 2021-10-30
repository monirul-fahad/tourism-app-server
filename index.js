const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

//middleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5uwr5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("travelApp");
    const eventsCollection = database.collection("events");
    const ordersCollection = database.collection("orders");

    //GET API
    app.get("/events", async (req, res) => {
      const cursor = eventsCollection.find({});
      const events = await cursor.toArray();
      res.send(events);
    });

    app.get("/orders", async (req, res) => {
      const cursor = ordersCollection.find({});
      const orders = await cursor.toArray();
      res.send(orders);
    });

    //GET Events single API
    app.get("/events/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const event = await eventsCollection.findOne(query);
      res.json(event);
    });

    //GET orders single API
    app.get("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const event = await ordersCollection.findOne(query);
      res.json(event);
    });

    //POST API
    app.post("/events", async (req, res) => {
      const event = req.body;
      console.log("hit the post api", event);

      const result = await eventsCollection.insertOne(event);
      console.log(result);
      res.json(result);
    });

    // Add Orders API
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await ordersCollection.insertOne(order);
      res.json(result);
    });

    // DELETE API
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);
      res.json(result);
    });
  } finally {
    // await client.close()
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Tourism website is running");
});

app.listen(port, () => {
  console.log("server running at port", port);
});
