const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-Parser');
const ObjectId = require('mongodb').ObjectID;
require('dotenv').config()
const port = process.env.PORT || 5050


app.use(cors());
app.use(bodyParser.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2ijdq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("shop").collection("groceries");
  const itemCollection = client.db("shop").collection("items");
    
    app.get('/products', (req, res) => {
        collection.find({})
        .toArray((err, items) => {
            res.send(items)
            //console.log('form databasegfgvjbj', items)
        })
    })


    app.get('/product/:id', (req, res) => {
      collection.find({_id: ObjectId(req.params.id)})
      .toArray((err, items) => {
          res.send(items[0])
          //console.log('form database', items)
      })
  })


    app.post('/addProduct', (req, res) => {
        const product = req.body;
        //console.log('added product', product)
        collection.insertOne(product)
        .then(result => {
            //console.log('added product', result.insertedCount)
            res.send(result.insertedCount > 0)
        })
    })

    app.delete('/delete/:id', (req, res) => {
      console.log(req.params.id)
      collection.deleteOne({_id:ObjectId( req.params.id)})
      .then( (result) => {
        //console.log(result)
      })
    })

    // Another db collection for order
    app.post('/addItem', (req, res) => {
      const item = req.body;
      console.log(item)
      itemCollection.insertOne(item)
      .then(result => {
          console.log('added items', result.insertedCount)
          res.send(result.insertedCount > 0)
      })
    })

  app.get('/item/:id', (req, res) => {
  itemCollection.find({_id: ObjectId(req.params.id)})
  .toArray((err, documents) => {
      res.send(documents[0])
      //console.log('form database', documents)
  })
})


});





app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})