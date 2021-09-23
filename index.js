require('dotenv').config()
const express = require('express');
const mainRouter=require('./src/routes/main')
const cors = require('cors');
const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true, //access-control-allow-credentials:true
    optionSuccessStatus:200
}

const app = express();
const port = process.env.PORT || 3000;
app.use(cors(corsOptions));
app.use(express.json())
app.use(mainRouter)


// Port
app.listen((port) => {
    console.log("listening on port " + port);
});
