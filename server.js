const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const port =  8000;
const serverRoutes = require('./routers/serverRoutes');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cloudinary = require('cloudinary');


app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static(__dirname))
app.use('/',serverRoutes);
cloudinary.config({
    cloud_name: 'dzya7ie76',
    api_key: process.env.CLOUD_API,
    api_secret: process.env.CLOUD_SECRET
})

const connection = async() =>{
try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log('successfully connected to Db');
    app.listen(port,()=>{console.log(`server runnning on port ${port}`)})
} catch (error) {
    console.log(error);
}    
}
connection(); 