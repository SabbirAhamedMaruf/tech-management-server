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
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const userCartCollection = database.collection("userCartCollection");

    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
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

    // ! Fetching brand for client home page
    app.get("/brands", async (req, res) => {
      const brands = brandCollection.find();
      const result = await brands.toArray();
      res.send(result);
    });

    //> Product Type Collection Operation
    //! Inserting data from client addtype
    app.post("/addtype", async (req, res) => {
      const currentBProductTypeData = req.body;
      const result = await productTypeCollection.insertOne(
        currentBProductTypeData
      );
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
    app.post("/addproduct", async (req, res) => {
      const currentProductData = req.body;
      const result = await productCollection.insertOne(currentProductData);
      res.send(result);
    });

    // ! Fetching featured product for homepage
    app.get("/featured", async (req, res) => {
      const query = { featured: "true" };
      const featuredProductData = productCollection.find(query);
      const result = await featuredProductData.toArray();
      res.send(result);
    });

    // ! Fetching brand based product for products page
    app.get("/brand/:brandname", async (req, res) => {
      const currentBrandUrl = req.params.brandname;
      const query = { brand: `${currentBrandUrl}` };
      const brandProducts = productCollection.find(query);
      const result = await brandProducts.toArray();
      res.send(result);
    });

    // ! Fetching product details data for product details page
    app.get("/brand/:brandname/:productDetailId", async (req, res) => {
      const currentProductId = req.params.productDetailId;
      const query = { _id: new ObjectId(currentProductId) };
      const currentProduct = productCollection.find(query);
      const result = await currentProduct.toArray();
      res.send(result);
    });

    //! Getting product data for update

    app.get("/brand/update/:productDetailId", async (req, res) => {
      const productId = req.params.productDetailId;
      console.log(productId);
      const query = { _id: new ObjectId(productId) };
      const result = await productCollection.findOne(query);
      res.send(user);
    });

    // ! Update product data

    app.put("/addproduct/:productDetailId", async (req, res) => {
      const id = req.params.productDetailId;
      const product = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedProduct = {
        $set: {
          photo: product.photo,
          name: product.name,
          type: product.type,
          brand: product.brand,
          featured: product.featured,
          price: product.price,
          rating: product.rating,
          warrenty: product.warrenty,
          description: product.description,
        },
      };
      const result = await productCollection.updateOne(
        filter,
        updatedProduct,
        options
      );
      res.send(result);
    });

    // > User Cart Collection Operation
    // ! Save Product inside from add to cart button on product details page
    app.post("/brand/:brandname/:productDetailId", async (req, res) => {
      const currentUserProduct = req.body;
      const result = await userCartCollection.insertOne(currentUserProduct);
      res.send(result);
    });

    // ! Get user cart for mycart page
    app.post("/mycart", async (req, res) => {
      const currentUser = req.body;
      console.log(currentUser);
      const query = { email: currentUser.email };
      const userCart = await userCartCollection.find(query);
      const result = await userCart.toArray();
      console.log(result);
      res.send(result);
    });

    // ! Delete product from user cart
    app.delete("/mycart/:productId", async (req, res) => {
      const currentId = req.params.productId;
      const query = { _id: new ObjectId(currentId) };
      const result = await userCartCollection.deleteOne(query);
      res.send(result);
    });
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
