const express = require('express');
const mainRouter=require('./src/routes/main')
const cors = require('cors');
const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true, //access-control-allow-credentials:true
    optionSuccessStatus:200
}

const app = express();
app.use(cors(corsOptions));
app.use(express.json())
app.use(mainRouter)


// Port
app.listen(3000, () => {
    console.log("listening on port 3000");
});
