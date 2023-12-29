const express = require('express');
const cors = require('cors');
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jlioc3w.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();

    const database = client.db("neclio");
    const projectCollection = database.collection("projects");

    app.get("/projects", async (req, res) => {
        const result = await projectCollection.find().toArray();
        res.send(result);
    })

    app.post("/projects", async (req, res) => {
        const newProject = req.body;
        const result = await projectCollection.insertOne(newProject);
        res.send(result);
    })

    app.patch("/projects/:id", async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const updateDoc = {
            $set: req.body,
        }
        const result = await projectCollection.updateOne(query, updateDoc);
        res.send(result);
    })

    app.delete("/projects/:id", async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        
        const result = await projectCollection.deleteOne(query);
        res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send("neclio is running")
})

app.listen(port, (req, res) => {
    console.log(`neclio is listening on ${port}`);
})