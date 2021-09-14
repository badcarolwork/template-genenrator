'use strict';

const gcStorage = require('../gcs_connection')
const { v4: uuidv4 } = require('uuid');
const replace = require('replace-in-file');
const fs = require('fs');
const tempDirectory = require('temp-dir');
const multer = require('multer');

const bucket = gcStorage.bucket('template-generator-35e82.appspot.com');
const bucketName = 'template-generator-35e82.appspot.com';
const originalFolder = "vib_320480/";
const newFolderPath = uuidv4()+'/';
const fileNamesToCopy = ['index.html', '320480.css','basicTracking.js','basicVideo.js','video_320480_contain-up.css'];
let copiedFileAmout = 0;
let stringtoReplace;
let filestoUpload;

const upload = multer({
  storage: multer.MemoryStorage,
}).fields([{name: "image_backup"}, {name: "image_banner"}]);


const startCreatefiles = async(req, res, next) =>{
 
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
      stringtoReplace = req.body;
      filestoUpload = req.files;
      console.log(stringtoReplace)
      if(Object.keys(stringtoReplace).length === 0 ||  Object.keys(filestoUpload).length === 0){
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
        dlInTempFolder(destFilePath, stringtoReplace)
    }   

}

const dlInTempFolder = (originaIndex) => {
    console.log('got run')
    let done = false;
    const localFile = tempDirectory + '/index.html';

  bucket.file(originaIndex + 'index.html').createReadStream()
    .on('error', (err) =>{
      console.log('read stream:' + err)
      done = false
      res.status(500).send({
        message:'Failed to upload new index, kindly try again.'
      })
    })  
    .on('response', (response) => {
        console.log('dlinTemp: '+ response)
    })
    .on('end', () => {
        done = true
        if(done){
            replaceStringinFiles(localFile);
            done = false;
        }

    })
    .pipe(fs.createWriteStream(localFile))    
}

const replaceStringinFiles = (indexFilePath) => {
  
  const index = {
    files: indexFilePath,
    from: ['_bannerImgName', '_bgImgName', '_video_url', '_banner_landing_url','_floodlight_src','_floodlight_type','_floodlight_cat','_floodlight_u3','_floodlight_u4'],
    to: [stringtoReplace.image_banner_name, 
      stringtoReplace.image_backup_name,
      stringtoReplace.video_url,
      stringtoReplace.banner_landing_url,
      stringtoReplace.floodlight_src,
      stringtoReplace.floodlight_type,
      stringtoReplace.floodlight_cat,
      stringtoReplace.floodlight_u3,
      stringtoReplace.floodlight_u4,    
    ],
  };
  replace(index)
  .then(results => {
      console.log('Replacement results:', results);
      uploadDeleteTempFile(indexFilePath)
      handleUploadImages(filestoUpload)
      
  })
  .catch(error => {
      console.error('Error occurred:', error);
      res.status(500).send({
        message:'Failed to create new index, kindly try again.'
      })
      return;
  });

}

const uploadDeleteTempFile = (localFilePath) => {
    const localPathFile =  fs.createReadStream(localFilePath);
    let folderToUpload = bucket.file(newFolderPath+'index.html');

    localPathFile.pipe(folderToUpload.createWriteStream())
    .on('error', (err) => {
        console.log('upload to: ' + err);
        res.status(500).send({
          message:'Failed to create new files, kindly try again.'
        })
        return;
    })
    .on('finish', ()=>{
        console.log('finish');
    })
}


    

module.exports = {
  startCreatefiles
}