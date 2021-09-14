'use strict';

const gcStorage = require('../gcs_connection')
const firebase = require('../gc_db_connection');
const firestore = firebase.firestore();
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');

const bucket = gcStorage.bucket('template-generator-35e82.appspot.com');
const bucketName = 'template-generator-35e82.appspot.com';
const newFolderPath = uuidv4()+'/';
let originalFolder = "";
let fileNamesToCopy = [];
let copiedFileAmout = 0;
let templateSettingValue;
let filestoUpload;

const upload = multer({
  storage: multer.MemoryStorage,
}).fields([{name: "image_backup"}, {name: "image_banner"}]);


const getTemplateElements = async (req, res, next)=>{
  // console.log(req.params.id)
  try {
      const template_elements = await firestore.collection('template_elements_backend').doc(req.params.id).get();
      
      if(template_elements.empty){
          res.status(404).send('List not found');
      }else{
        fileNamesToCopy = template_elements.data().files_to_copy;
        originalFolder = template_elements.data().gcs_folder_name;        
       
        startCreatefiles(req,res)
          
      }
      
  } catch (error) {
      res.status(400).send(error.message);
  }
}

const startCreatefiles = async (req, res, next) =>{
 
  upload(req, res, (err) => {  
    if(err) {
      res.status(500).send({
        message:'upload failed'
      })
      return;
    }else if (!req.files) {
      res.status(500).send({
        message:'upload failed'
      })
      return;
    }
    else {
      templateSettingValue = JSON.stringify(req.body);
      filestoUpload = req.files;
     
      // console.log(templateSettingValue)
      if(Object.keys(templateSettingValue).length === 0 ||  Object.keys(filestoUpload).length === 0){
         res.status(500).send({
          message:'No valid data found'
        })
         return;
      }
      else{
        for (const fileNameEach of fileNamesToCopy) {
          const fileName = fileNameEach;
          // console.log(fileName)
          createNewTemplateFolder(bucketName, originalFolder + fileName,bucketName, newFolderPath + fileName, newFolderPath);      
        } 
      }

      
    }
  })    
}

const handleUploadImages = (files) =>{

  // need to do validation 
  for (const key in files) {       
    const element = files[key];
    element.forEach(file => {
      console.log(file.originalname)

      const blob = bucket.file(newFolderPath + file.originalname);
      const blobStream = blob.createWriteStream();

      blobStream.on('finish', () => {
        // counter+=1
        // The public URL can be used to directly access the file via HTTP.
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${newFolderPath}/${blob.name}`

        // if(counter >= 2){
        //   res.status(200).send({
        //     message:'All successed'
        //   })
        // }else{
        //   res.status(500).send({
        //     message:'upload failed'
        //   })
        // }
    
      });   
          
      blobStream.end(filestoUpload.buffer);
    });
  }
}

const createNewTemplateFolder = async (srcBucketName, srcFilename, destBucketName,destFileName, destFilePath) =>{
    // Copies the file to the new folder
    await gcStorage
      .bucket(srcBucketName)
      .file(srcFilename)
      .copy(gcStorage.bucket(destBucketName).file(destFileName))
      .then(() =>{
        console.log('copy done '+ destFileName)
        copiedFileAmout++
      })
      .catch((err) =>{
        console.log(err)
        copiedFileAmout--
        res.status(500).send({
          message:'Failed to upload new folder, kindly try again.'
        })
      })
      
    if(copiedFileAmout === fileNamesToCopy.length){
      // const file = bucket.file(newFolderPath + 'index.html');
      const objData = JSON.parse(templateSettingValue);
      let indexToChange =`<!DOCTYPE html>
      <html lang="en">      
      <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta name="viewport" content="initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, width=device-width" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="stylesheet" href="320480.css" />
        <script src="https://s0.2mdn.net/ads/studio/Enabler.js"></script>
      </head>      
      <body>
        <div id="mainContainer">
          <div id="exitBox"><img src='${objData.image_banner_name}'></div>
          <div id="featureBox">
            <div id="bg">
              <img class="imgct1" src='${objData.image_backup_name}'>
            </div>
            <div id="box">
              <div id="videoBox"></div>
            </div>
          </div>
        </div>     
        <script type="text/javascript" src="basicTracking.js"></script>
        <script type="text/javascript" src="basicVideo.js"></script>
        <script>
          const videoUrl = '${objData.video_url}';
          const bannerLandingUrl = '${objData.banner_landing_url}';
          const fldSrc= '${objData.floodlight_src}';
          const fldType='${objData.floodlight_type}';
          const fldCat ='${objData.floodlight_cat}';
          const fldU3 = '${objData.floodlight_u3}';
          const fldU4 = '${objData.floodlight_u4}';
        </script>     
      </body>      
      </html>`


       // insert append script to file function
      
       const indexToAppend = bucket.file(newFolderPath + 'index.html');
       indexToAppend.save(indexToChange, function(err) {
        if (!err) {
          console.log("append ok")
          handleUploadImages(filestoUpload)
        }
      });
       return;

    }   

}
 

module.exports = {
  getTemplateElements,
  startCreatefiles
}