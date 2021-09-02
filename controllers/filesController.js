'use strict';

const {Storage} = require('@google-cloud/storage');
const { v4: uuidv4 } = require('uuid');
const replace = require('replace-in-file');
const fs = require('fs');
const os = require('os');
const tempDirectory = require('temp-dir');


const storage  = new Storage({
    keyFilename: 'template-generator-35e82-be49740e7c14.json'
});

const bucket = storage.bucket('template-generator-35e82.appspot.com');
const bucketName = 'template-generator-35e82.appspot.com';
const originalFolder = "vib_320480/";
const newFolderPath = uuidv4()+'/';
const fileNamesToCopy = ['index.html', '320480.css','basicTracking.js','basicVideo.js','video_320480_contain-up.css'];
let copiedFileAmout = 0;
let stringtoReplace;

const loopFiles = async(request,response) =>{
    stringtoReplace= request.body;   

    for (const fileNameEach of fileNamesToCopy) {
        const fileName = fileNameEach;
        // console.log(fileName)
        createNewTemplateFolder(bucketName, originalFolder + fileName,bucketName, newFolderPath + fileName, newFolderPath);      
    }   
      
    response.send("Folder Created ok.")

}

const createNewTemplateFolder = async (srcBucketName, srcFilename, destBucketName,destFileName, destFilePath) =>{
    // Copies the file to the new folder
    await storage
      .bucket(srcBucketName)
      .file(srcFilename)
      .copy(storage.bucket(destBucketName).file(destFileName))
      .then(() =>{
        console.log('copy done '+ destFileName)
        copiedFileAmout++
      })
      .catch((err) =>{
        console.log(err)
        copiedFileAmout--
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
//   console.log(stringtoReplace)
//   console.log('path:' + indexFilePath)
  
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
  });
}

const uploadDeleteTempFile = (localFilePath) => {
    const localPathFile =  fs.createReadStream(localFilePath);
    let folderToUpload = bucket.file(newFolderPath);

    localPathFile.pipe(folderToUpload.createWriteStream())
    .on('error', (err) => {
        console.log('upload to: ' + err);
    })
    .on('finish', ()=>{
        console.log('finish');
    })
}

module.exports = {
    loopFiles
}