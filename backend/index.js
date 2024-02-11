const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const cors = require('cors')
dotenv.config();
const mongoose = require('mongoose');
const File = require('./model/file.model');
const app = express();
const port = 3001;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  
  const storage = multer.memoryStorage();
  const upload = multer({ storage: storage });
app.use(cors())
  mongoose.connect(process.env.MONGO)
  .then(() =>{
    console.log("Connected")
    app.get('/show',async(req,res)=>{
    //    const response= await File.find({});
       res.json(await File.find({}))
    })
    
    app.post('/upload', upload.single('file'), async (req, res) => {
      try {
        const result = await cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
          if (error) {
            console.error('Error uploading to Cloudinary:', error);
            return res.status(500).json({ error: 'Error uploading to Cloudinary' });
          }
          const newFile = new File({
            url:result.secure_url
          })
          newFile.save()
          .then((savedFile) => {
            console.log('File saved:', savedFile);
          })
          .catch((error) => {
            console.error('Error saving file:', error);
          });
          res.json({ imageUrl: result.secure_url });
        }).end(req.file.buffer);
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server error' });
      }
    });
    
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
    
  }
  
  );





