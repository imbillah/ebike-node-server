const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const app = express();
const port = process.env.PORT || 7000;

app.use(cors());
app.use(express.json());

const uri = process.env.DB_URI;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// function
const run = async () => {
  try {
    await client.connect();
    const database = client.db("Ebike");
    const productCollection = database.collection("products");
    const userCollection = database.collection("users");
    const reviewCollection = database.collection("reviews");
    const orderCollection = database.collection("orders");

    //  sending product data to DB
    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      const result = await productCollection.insertOne(newProduct);
      res.send(result);
    });

    // getting product data from DB
    app.get("/products", async (req, res) => {
      const products = await productCollection.find({}).toArray();
      res.send(products);
    });
    // sending user review to DB
    app.post("/reviews", async (req, res) => {
      const newReview = req.body;
      const result = await reviewCollection.insertOne(newReview);
      res.send(result);
    });
    // getting review data
    app.get("/reviews", async (req, res) => {
      const reviews = await reviewCollection.find({}).toArray();
      res.send(reviews);
    });
    // sending user info to DB
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });
    // Loading single product by id
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productCollection.findOne(query);
      res.send(product);
    });
    // sending user oder data to DB
    app.post("/orders", async (req, res) => {
      const newOrder = req.body;
      const result = await orderCollection.insertOne(newOrder);
      res.send(result);
    });
  } finally {
  }
};

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running Ebike Server");
});
app.listen(port, () => {
  console.log(`Running my server on port ${port}`);
});
