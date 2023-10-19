const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

// require for local connection
app.use(cors());

// require for getting json data.
app.use(express.json());

// Intregrating environment variable
require("dotenv").config();

// MongoDB config
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.TECH_HEAVEN_USER}:${process.env.TECH_HEAVEN_PASS}@cluster0.pzharqa.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Database Information
    const database = client.db("TechHeaven");
    const brandCollection = database.collection("brandCollection");
    const productTypeCollection = database.collection("productTypeCollection");
    const productCollection = database.collection("productCollection");

    // TODO need to delete this line when i wanted to deploy in vercel
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    //> Brand Collection Operation
    //! Fetching data for add product page (Brand)
    app.get("/addproduct", async (req, res) => {
      const searchedBrand = await brandCollection.find();
      const result = await searchedBrand.toArray();
      res.send(result);
    });

    //! Inserting data from client addbrand
    app.post("/addbrand", async (req, res) => {
      const currentBrandData = req.body;
      const result = await brandCollection.insertOne(currentBrandData);
      res.send(result);
    });




    //> Product Type Collection Operation
    //! Inserting data from client addtype
    app.post("/addtype", async (req, res) => {
      const currentBProductTypeData = req.body;
      const result = await productTypeCollection.insertOne(currentBProductTypeData);
      res.send(result);
    });

    //! Fetching data for add product page (Product Type)
    app.get("/addtype", async (req, res) => {
      const searchedProductType = await productTypeCollection.find();
      const result = await searchedProductType.toArray();
      res.send(result);
    });


    //> Product Collection Operation
    //! Inserting product into database
    app.post("/addproduct",async(req,res)=>{
      const currentProductData = req.body;
      const result = await productCollection.insertOne(currentProductData);
      res.send(result);
    })



  } finally {
  }
}
run().catch(console.dir);

// Server config
app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(port, () => {
  console.log(`Server is currently listening on port = ${port}`);
});
