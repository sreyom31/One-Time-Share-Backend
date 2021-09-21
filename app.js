require('dotenv').config()
const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const { v4: uuid } = require('uuid');
const fs = require('fs');

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
        fieldSize: 1024*1024*10
    }
})

// Routes
app.get('/', (req, res) => {
    app.get
})

app.post('/upload', upload.single('file'), (req, res) => {
    let myFile = req.file.originalname.split(".");
    const fileExtension = myFile[myFile.length - 1];

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
    });
})

app.get('/download/:key', (req, res) => {
    const key = req.params.key;
    const filePath = req.params.key;
    console.log(filePath);
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key
    }
    s3.getObject(params, (err, data) => {
        if(err) {
            console.log(err);
        }
        console.log(data);
        fs.writeFileSync(filePath, data.Body);
        console.log(`${filePath} has been created!!!`);
    });
    s3.deleteObject(params, (err) => {
        if(err){
            console.log(err);
        }
    });
});

// Port
app.listen(3000, () => {
    console.log("listening on port 3000");
});
