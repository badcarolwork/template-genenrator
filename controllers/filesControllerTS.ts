'use strict';

import express, { Request, Response } from 'express';
import {Storage} from '@google-cloud/storage';
const { v4: uuidv4 } = require('uuid');
const replace = require('replace-in-file');
const fs = require('fs');
const os = require('os');
const tempDirectory = require('temp-dir');


const storage  = new Storage({
    keyFilename: 'template-generator-35e82-be49740e7c14.json'
});


const bucket = storage.bucket('template-generator-35e82.appspot.com');
const bucketName: string = 'template-generator-35e82.appspot.com';
const originalFolder: string = "vib_320480/";
const newFolderPath: string = uuidv4()+'/';
const fileNamesToCopy: Array<string> = ['index.html', '320480.css','basicTracking.js','basicVideo.js','video_320480_contain-up.css'];
let copiedFileAmout: number = 0;
let stringtoReplace: string|number;



const loopFiles = async(request:Request, response: Response ) =>{
    if(request != undefined){
        stringtoReplace = request.body;   
    }else{
        response.send('No input data found')
    }
    

    for (const fileNameEach of fileNamesToCopy) {
        const fileName = fileNameEach;
        // console.log(fileName)
        createNewTemplateFolder(bucketName, originalFolder + fileName,bucketName, newFolderPath + fileName, newFolderPath);      
    }   

}

const createNewTemplateFolder = async (srcBucketName: string, srcFilename: string, destBucketName: string, destFileName: string, destFilePath: string) =>{
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
        sendRespone('failed')
      })
      
    if(copiedFileAmout === fileNamesToCopy.length){
        dlInTempFolder(destFilePath, stringtoReplace)
    }   

}

const dlInTempFolder = (originaIndex: string) => {
    console.log('got run')
    let done = false;
    const localFile = tempDirectory + '/index.html';

  bucket.file(originaIndex + 'index.html').createReadStream()
    .on('error', (err) =>{
      console.log('read stream:' + err)
      done = false
      sendRespone('failed')
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

const replaceStringinFiles = (indexFilePath: string) => {
//   console.log(stringtoReplace)
//   console.log('path:' + indexFilePath)
  
  const index = {
    files: indexFilePath,
    from: ['_bgImgName', '_bannerImgName'],
    to: [stringtoReplace.image_backup, stringtoReplace.image_banner],
  };
  replace(index)
  .then((results:String) => {
      console.log('Replacement results:', results);
      uploadDeleteTempFile(indexFilePath)
  })
  .catch((error:String) => {
      console.error('Error occurred:', error);
      sendRespone('failed')
  });
}

const uploadDeleteTempFile = (localFilePath: string) => {
    const localPathFile =  fs.createReadStream(localFilePath);
    let folderToUpload = bucket.file(newFolderPath+'index.html');

    localPathFile.pipe(folderToUpload.createWriteStream())
    .on('error', (err:String) => {
        console.log('upload to: ' + err);
        sendRespone('failed', ...process.argv.slice(2))
    })
    .on('finish', ()=>{
        console.log('finish');
    })
}

const sendRespone = (request:Request, response:Response, status:String) =>{

    if(status === 'success'){
        response.sendStatus(200).send("New files has been created.")
    }else{
        response.sendStatus(500).send("New files has been created.")
    }
}
    

module.exports = {
    loopFiles
}