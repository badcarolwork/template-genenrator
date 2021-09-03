'use strict';

const gcStorage = require('../gcs')
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


const imageFilter = function (request, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        request.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

const handleUploadImages = () =>{
    const storage = multer.diskStorage({
        destination: (request, file, cb) => {
            cb(null, bucketName+newFolderPath);
        },
        filename: (request, file, cb) => {
            cb(null, file.filename)
        }
    })

    const upload = multer({ storage }).fields([{ name: "bgImg" }, { name: "bannerImg" }])

    upload(request, response, (err) => {
        // console.log(req.body)
        if (request.fileValidationError) {
            return response.send(req.fileValidationError);
        }
        else if (!request.files) {
            return response.send('Please select an image to upload');
        }
        else if (err instanceof multer.MulterError) {
            return request.send(err);
        }
        else if (err) {
            return request.send(err);
        } else {
            // get img file names
            let bgImgName, bannerImgName, imgname = [];
            Object.values(req.files).map(i => {
                i.forEach((v) => {
                    imgname.push(v.originalname)
                })
            });
            bgImgName = imgname[0];
            bannerImgName = imgname[1];
        }
    })
}

const loopFiles = async(request,response, next) =>{
    console.log(request.file)

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
        sendRespone('failed')
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
      sendRespone('failed')
  });
}

const uploadDeleteTempFile = (localFilePath) => {
    const localPathFile =  fs.createReadStream(localFilePath);
    let folderToUpload = bucket.file(newFolderPath+'index.html');

    localPathFile.pipe(folderToUpload.createWriteStream())
    .on('error', (err) => {
        console.log('upload to: ' + err);
        sendRespone('failed')
    })
    .on('finish', ()=>{
        console.log('finish');
    })
}

const sendRespone = (status) =>{

    if(status === 'success'){
        response.status(200).send("New files has been created.")
    }else{
        response.status(500).send("New files has been created.")
    }
}
    

module.exports = {
    loopFiles,
    imageFilter
}