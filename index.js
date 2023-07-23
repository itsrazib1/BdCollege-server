const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

require('dotenv').config();


app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4hmio3i.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
     client.connect();
    

    const collegesCollection = client.db("BDCollege").collection("colleges");
    const applyCollection    = client.db("BDCollege").collection("'application'");

    app.get("/colleges", async (req, res) => {
      const result = await collegesCollection.find().toArray();
      res.send(result);
    });

    app.get("/details/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await collegesCollection.findOne(query);
      res.send(result);
    });

    app.get("/myCollege", async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const result = await applyCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/apply", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await applyCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "user already existing" });
      }
      const result = await applyCollection.insertOne(user);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) =>{
    res.send('Bdcollege is running')
})
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
