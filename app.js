require('dotenv').config()
const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const { v4: uuid } = require('uuid');

const app = express();

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET
})

// Middlewares
app.use(express.static('public'));
app.use(express.json());


// View Engine
app.set('view engine', 'ejs');

// Controller functions
const storage = multer.memoryStorage({
    destination: (req, file, cb) => {
        cb(null, '')
    }
})

const upload = multer({
    storage,
    limits: {
        fieldSize: 1024*1024*5
    }
})

// Routes
app.post('/upload', upload.single('file'), (req, res) => {
    let myFile = req.file.originalname.split(".")
    const fileExtension = myFile[myFile.length - 1]

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${uuid()}.${fileExtension}`,
        Body: req.file.buffer
    }

    s3.upload(params, (err, data) => {
        if(err){
            res.status(400).send(err);
        }
        res.status(200).send(data);
    })
});

app.get('/download', (req, res) => {

});

// Port
app.listen(3000, () => {
    console.log("listening on port 3000");
})
