const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('eSchool Manger is running.....|>>>')
})


const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@eschoolmanager.3ihpgqe.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


const run = async () => {

  try {
    await client.connect();
    const studentCollection = client.db('eschoolmanager').collection('students');


    // get all the students

    app.get('/allstudents', async (req, res) => {
      const query = {};
      const cursor = studentCollection.find(query);
      const students = await cursor.toArray();
      res.send(students);
    })

    // add new student

    app.post('/addStudent', async (req, res) => {
      const studentInfo = req.body;
      const result = await studentCollection.insertOne(studentInfo);
      res.send(result);
    })

    // Delete Student

    app.delete('/student/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await studentCollection.deleteOne(query);
      res.send(result);
    })

    // Update Student

    app.put('/student/:id', async (req, res) => {
      const id = req.params.id;
      const student = req.body;
      const filter = { _id: ObjectId(id)};
      const option = { upsert: true };
      const updateStudent = {
        $set: student,
      };
      const result = await studentCollection.updateOne(filter, updateStudent, option);
      res.send(result);
    })


    // Last bracket 
  }

  finally {

    // Console Close

  }
}

run().catch(console.dir);


app.listen(port, () => {
  console.log(`Listening to port ${port}`)
})