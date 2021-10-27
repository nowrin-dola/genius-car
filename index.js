const express=require('express');
const { MongoClient } = require('mongodb');
const cors = require ('cors');
const ObjectId = require ('mongodb').ObjectId;
require('dotenv').config()

const app= express();
const port = process.env.PORT || 5000;


// middleware

app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fw2fr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database=client.db('carMechanic')
        const serviceCollection = database.collection('services');

        // get api
        app.get('/services', async(req, res)=>{
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });
        
        // get api

        app.get('/services/:id', async (req, res)=>{
            const id=req.params.id;
            console.log('getting id', id)
            const query={_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query)
            res.json(service)
        })

        // post api
        app.post('/services', async(req, res)=>{
            const service = req.body;


            console.log('api is hitted', service)
        //     const service={
        //         "name": "WHEEL ALIGNMENT",
        // "price": "100",
        // "description": "Lorem ipsum dolor sit amet, consectetu radipisi cing elitBeatae autem aperiam nequ quaera molestias voluptatibus harum ametipsa.",
        // "img": "https://i.ibb.co/tY8dmnP/2.jpg"

        //     }

            const result = await serviceCollection.insertOne(service);
            console.log(result)
            
            res.json(result)
        });


        // delete api
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.deleteOne(query);
            res.json(result);
        })


        // app.delete('/services/:id', async (req,res)=>{
        //     const id = req.params.id;
        //     console.log('deleting id', id)
        //     const query={_id: ObjectId(id)};
        //     const result = await serviceCollection.deleteOne(query)
        //     res.send(result)
        // })

    }
    finally{
        // await client.close();

    }

}
run().catch(console.dir)


app.get('/', (req,res)=>{
    res.send('hello mongodb');
})

app.listen(port, ()=>{
    console.log(`Example app listening at http://localhost:${port}`)
})