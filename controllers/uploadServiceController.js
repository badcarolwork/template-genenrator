'use strict';


const processFile = require("../middleware/imageUpload");
const { format } = require("util");
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



const handleUploadImages = async (req, res) =>{
  try {
    await processFile(req, res);

    if (!req.file) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    // Create a new blob in the bucket and upload the file data.
    const blob = bucket.file(newFolderPath + req.file.originalname);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream.on("error", (err) => {
      res.status(500).send({ message: err.message });
    });

    blobStream.on("finish", async (data) => {
      // Create URL for directly file access via HTTP.
      const publicUrl = format(
        `https://storage.googleapis.com/${bucket.name}/${newFolderPath}/${blob.name}`
      );

      try {
        // Make the file public
        await bucket.file(newFolderPath + req.file.originalname).makePublic();
      } catch {
        return res.status(500).send({
          message:
            `Uploaded the file successfully: ${newFolderPath + req.file.originalname}, but public access is denied!`,
          url: publicUrl,
        });
      }

      res.status(200).send({
        message: "Uploaded the file successfully: " + newFolderPath + req.file.originalname,
        url: publicUrl,
      });
    });

    blobStream.end(req.file.buffer);
  } catch (err) {
    console.log(err)
    // res.status(500).send({
    //   message: `Could not upload the file: ${req.file.originalname}. ${err}`,
    // });
  }
}



const loopFiles = async(request, response, next) =>{
    console.log(request.file)
    console.log(request.body)

    stringtoReplace= request.body;   

    for (const fileNameEach of fileNamesToCopy) {
        const fileName = fileNameEach;
        // console.log(fileName)
        // createNewTemplateFolder(bucketName, originalFolder + fileName,bucketName, newFolderPath + fileName, newFolderPath);      
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
        sendRespone(500, 'Failed to upload new folder, kindly try again.')
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
      sendRespone(500, 'Failed to upload new index, kindly try again.')
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
    from: ['_bgImgName', '_bannerImgName'],
    to: [stringtoReplace.image_backup, stringtoReplace.image_banner],
  };
  replace(index)
  .then(results => {
      console.log('Replacement results:', results);
      uploadDeleteTempFile(indexFilePath)
  })
  .catch(error => {
      console.error('Error occurred:', error);
      sendRespone(500, 'Failed to create new index, kindly try again.')
  });

}

const uploadDeleteTempFile = (localFilePath) => {
    const localPathFile =  fs.createReadStream(localFilePath);
    let folderToUpload = bucket.file(newFolderPath+'index.html');

    localPathFile.pipe(folderToUpload.createWriteStream())
    .on('error', (err) => {
        console.log('upload to: ' + err);
        sendRespone(500, 'Failed to create new files, kindly try again.')
    })
    .on('finish', ()=>{
        console.log('finish');
        handleUploadImages()
    })
}


const sendRespone = (status, msg) =>{

    if(status === 200){
        response.status(200).send({
          message:msg
        })
    }else{
        response.status(500).send({
          message:msg
        })
    }
}
    

module.exports = {
    loopFiles
}