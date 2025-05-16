const express = require('express');
const cors=require('cors');
const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb')
const app=express();
const port=process.env.PORT || 3000;


// user: simpleDBUser
// pass: Vx8i4FpNEL8X9hBo
app.use(cors())
app.use(express.json())
const uri = "mongodb+srv://simpleDBUser:Vx8i4FpNEL8X9hBo@cluster0.52sdtnn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
    try{
        await client.connect();
        const usersCollection=client.db('usersdb').collection('users')

        app.get('/users', async(req,res)=>{
            const cursor= usersCollection.find()
            const result= await cursor.toArray();
            res.send(result);
        })

        app.get('/users/:id',async (req,res)=>{
            console.log(req.params);
            const id=req.params.id
            const query={_id: new ObjectId(id)}
            const result=await usersCollection.findOne(query)
            res.send(result);
        })

        app.post('/users', async(req,res)=>{
            const newUser=req.body;
            const result=await usersCollection.insertOne(newUser);
            res.send(result);
        })

        app.put('/users/:id',async (req,res)=>{
            
            const id=req.params.id
            const query={_id: new ObjectId(id)}
            const user=req.body;
            const updatedDoc={
                $set:{
                    name:user.name,
                    email:user.email
                }
            }
            const options={upsert:true};
            const result=await usersCollection.updateOne(query,updatedDoc,options);
            res.send(result);
        })

        app.delete('/users/:id',async (req,res)=>{
            console.log(req.params);
            const id=req.params.id
            const query={_id: new ObjectId(id)}
            const result=await usersCollection.deleteOne(query)
            res.send(result);
        })

        await client.db('admin').command({ping: 1})
        console.log('connected successfully');
    }finally{

    }
}
run().catch(console.dir)

app.get('/',(req,res)=>{
    res.send('simple crud server running soon');
})

app.listen(port, ()=>{
console.log(`simple crud server running on port ${port}`);
})