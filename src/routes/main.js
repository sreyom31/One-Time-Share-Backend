require('dotenv').config()
const express =require('express')
const multer = require('multer');
const { v4: uuid } = require('uuid');
const fs = require('fs');
const s3=require('../db/aws')

const router= new express.Router()

const storage = multer.memoryStorage({
    destination: (req, file, cb) => {
        cb(null, '')
    }
})

const upload = multer({
    storage,
    limits: {
        fieldSize: 1024*1024*1024*10
    }
})



// Routes
router.get('/', (req, res) => {
    res.status(200).send("<h1>Up and Running...</h1>")
})

router.post('/upload', upload.single('file'), async(req, res) => {
    try{
        const myFile = req.file.originalname;
        const fileExtension = myFile.slice(-3);
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${uuid()}.${fileExtension}`,
            Body: req.file.buffer
        }
        s3.upload(params, (err, data) => {
            if(err){
                res.status(503).send(err);
            }
            console.log(data.key)
            res.status(200).send(data);
        })
    }catch(err){
        res.status(400).send(err);
    }

})

router.get('/download/:key',async (req, res) => { 
try {
    const filePath = req.params.key;
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: filePath,
    }
    const data = await s3.getObject(params).promise();
    console.log(data.Body)
    await res.status(200).send(data.Body);
    await s3.deleteObject(params).promise()
    if (fs.existsSync(__dirname + '/upload/'+filePath)) {
        fs.unlink(__dirname + '/upload/'+filePath, (err) => {
            if (err) {
                console.log(err);
            }
            console.log('deleted');
        })
    }
    
    

} catch (error) {
    res.status(400).send(error);
}
});

module.exports = router;