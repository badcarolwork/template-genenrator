const express = require('express');
const multer = require('multer');
const gcStorage = require('../gcs_connection')
const router = express.Router();


var upload = multer({storage: multer.memoryStorage()}).fields([{ name: 'image_backup', maxCount: 1 },{ name: 'image_banner', maxCount: 1 }])

const {loopFiles} = require('../controllers/uploadServiceController');


// router.post('/file', multer.single('image_backup'), loopFiles);

router.post('/file', upload, (req, res, next)=>{
    // console.log(req.file)
    if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        console.log(err)
      } else if (err) {
        // An unknown error occurred when uploading.
        console.log(err)
      }
    console.log(req.body.data)
});

module.exports={
    routes: router
}