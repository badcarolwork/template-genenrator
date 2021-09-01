
const {Storage} = require('@google-cloud/storage');
const { v4: uuidv4 } = require('uuid');
const replace = require('replace-in-file');
const fs = require('fs');
const os = require('os');


const storage  = new Storage({
    keyFilename: 'template-generator-35e82-be49740e7c14.json'
});

const bucket = storage.bucket('template-generator-35e82.appspot.com');

const bucketName = 'template-generator-35e82.appspot.com';
const originalFolder = "vib_320480/";
const newFolderPath = uuidv4()+'/';
const fileNamesToCopy = ['index.html', '320480.css','basicTracking.js','basicVideo.js','video_320480_contain-up.css'];

let copyFileStatus = false;


const loopFiles = () =>{
  for (const fileNameEach of fileNamesToCopy) {
    const fileName = fileNameEach;
    // console.log(fileName)
    createNewTemplateFolder(bucketName, originalFolder + fileName,bucketName, newFolderPath + fileName);      
  }
  if(copyFileStatus){
    uploadCombineDelete(newFolderPath+'/index.html')
  }

}


const createNewTemplateFolder = async (srcBucketName,  srcFilename, destBucketName,destFileName) =>{
    // Copies the file to the new folder
    await storage
      .bucket(srcBucketName)
      .file(srcFilename)
      .copy(storage.bucket(destBucketName).file(destFileName))
      .then(() =>{
        // console.log('copied')
        copyFileStatus = true;
      }).catch((err) =>{
        console.log(err)
        copyFileStatus = false;
      });

    // console.log(`gs://${srcBucketName}/${srcFilename} copied to gs://${destBucketName}/${destFileName}`);
    // console.log(copyFileStatus)
}


const uploadCombineDelete = (originaIndex, originalJs, data) => {

  // const localFiles = [os.tmpdir() + '/index.html',os.tmpdir() + '/basicTracking.html' ]
  const localFile = os.tmpdir() + '/index.html';
  let inputdata = "";
  bucket.file(originaIndex).createReadStream(originaIndex)
    .on('error', (err) =>{
      // console.log(err)
    })
    .on('response', (response) => {
      // console.log(response)
    })
    .on("data", (chunk) => {
      inputdata += chunk;
    })
    .on('end', () =>{
      console.log('input:'+inputdata)
    })
    // .pipe(fs.createWriteStream(localFile));

}

const getFile =(path) => {
  
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

module.exports = {loopFiles}