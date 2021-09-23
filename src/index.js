const express = require('express');
const mainRouter=require('./routes/main')
const cors = require('cors');
const corsOptions ={
    origin:'https://networkplex.netlify.app', 
    credentials:true, //access-control-allow-credentials:true
    optionSuccessStatus:200
}

const app = express();
const port = process.env.PORT;
app.use(cors(corsOptions));
app.use(express.json())
app.use(mainRouter)


// Port
app.listen(port, () => {
    console.log("server has started successfully on PORT: " + port);
});
