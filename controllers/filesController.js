'use strict';

const {Storage} = require('@google-cloud/storage');
const { v4: uuidv4 } = require('uuid');
const storage  = new Storage({
    keyFilename: 'template-generator-35e82-be49740e7c14.json'
});
const bucket = storage.bucket('template-generator-35e82.appspot.com');
const replace = require('replace-in-file');

const path = "./file/vib_320480"

let uuidForThisJob = '';

const imageFilter = function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

const handleUploadImages = (request, response)=>{
    console.log(request)
    // create a folder in storage 

    // upload image to firebase storage 
}
const handleCopyfilesVIB320480 = () =>{
    const bucketName = 'template-generator-35e82.appspot.com';
    const originalFolder = "vib_320480/";
    const newFolderPath = uuidv4()+'/';
    const fileNamesToCopy = ['index.html', '320480.css','basicTracking.js','basicVideo.js','video_320480_contain-up.css'];
    uuidForThisJob = newFolderPath;

    for (const fileNameEach of fileNamesToCopy) {
        const fileName = fileNameEach;
        // console.log(fileName)
        createCopyNewFiles(bucketName, originalFolder + fileName,bucketName, newFolderPath + fileName);        
    }

    function createCopyNewFiles(srcBucketName,  srcFilename, destBucketName, destFileName) {
        async function copyFile() {
         // Copies the file to the new folder
         await storage
           .bucket(srcBucketName)
           .file(srcFilename)
           .copy(storage.bucket(destBucketName).file(destFileName));
     
         console.log(`gs://${srcBucketName}/${srcFilename} copied to gs://${destBucketName}/${destFileName}`);

         replaceValueNewFiles(newFolderPath)
       }
     
       copyFile().catch(console.error);
     }

}

const replaceValueNewFiles = (request, response, path) =>{
    // console.log(request.body)
    let data = request.body
    response.send(request.body)

    const index = {
        files: path + '/index.html',
        from: ['_bgImgName', '_bannerImgName'],
        to: [data.image_backup, data.image_banner],
    };

    const bsTrack = {
        files: path + '/basicTracking.js',
        from: [ '_fldSrc', '_fldType', '_fldCat', '_fldU3', '_fldU4','_vidFilePath'],
        to: [ data.floodlight_src, data.floodlight_type, data.floodlight_cat, data.floodlight_u3, data.floodlight_u4, data.video_url ]
    };

    replace(bsTrack)
        .then(results => {
            console.log('Replacement results:', results);
        })
        .catch(error => {
            console.error('Error occurred:', error);
        });

    replace(index)
    .then(results => {
        console.log('Replacement results:', results);
    })
    .catch(error => {
        console.error('Error occurred:', error);
    });


}


const handleGetDownloadLink = (request, response)=>{
    console.log(request)
    // get download link from Storage // index.html, js , css

    // upload image to firebase storage 
}



module.exports = {
    replaceValue,
    handleUploadImages,
    imageFilter
}