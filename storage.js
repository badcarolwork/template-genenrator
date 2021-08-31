
const {Storage} = require('@google-cloud/storage');
const { v4: uuidv4 } = require('uuid');


const storage  = new Storage({
    keyFilename: 'template-generator-35e82-be49740e7c14.json'
});

const bucket = storage.bucket('template-generator-35e82.appspot.com');

const bucketName = 'template-generator-35e82.appspot.com';
const originalFolder = "vib_320480/";
const newFolderPath = uuidv4()+'/';
const fileNamesToCopy = ['index.html', '320480.css','basicTracking.js','basicVideo.js','video_320480_contain-up.css'];


for (const fileNameEach of fileNamesToCopy) {
    const fileName = fileNameEach;
    // console.log(fileName)
   createNewTemplate(bucketName, originalFolder + fileName,bucketName, newFolderPath + fileName);
    
}

function createNewTemplate(srcBucketName,  srcFilename, destBucketName,destFileName) {
   async function copyFile() {
    // Copies the file to the new folder
    await storage
      .bucket(srcBucketName)
      .file(srcFilename)
      .copy(storage.bucket(destBucketName).file(destFileName));

    console.log(
      `gs://${srcBucketName}/${srcFilename} copied to gs://${destBucketName}/${destFileName}`
    );
  }

  copyFile().catch(console.error);
//   [END storage_copy_file]
}





// for (const fileName of fileNamesToCopy) {
//     //    originalFile = fileName; 
//        async function copyFile(){
//         await storage
//         .bucket(bucket)
//         .file(originalFolder+'/'+fileName)
//         .copy(storage.bucket(bucket).file(newFolderPath+'/'+fileName));

//         console.log(`gs://${srcBucketName}/${bucket} copied to gs://${bucket}/${destFileName}`);
//        return copyFile().catch(console.error);    
//     } 
// }
    

// const originalFiles = ['vib_320480/index.html', 'vib_320480/320480.css','vib_320480/basicTracking.js','vib_320480/basicVideo.js','vib_320480/video_320480_contain-up.css'];
// const newfiles = [newFolderPath+'index.html', newFolderPath+'320480.css',newFolderPath+'basicTracking.js',newFolderPath+'basicVideo.js',newFolderPath+'video_320480_contain-up.css'];

// for (const originalFile of originalFiles && const newFile of newFiles ) {
//     for (const newFile of newFiles ) {

//         const srcBucketName = bucket;
//         const srcFilename = originalFile;
//         const destBucketName = bucket;
//         const destFileName = newFile;

//         const copyFile = await storage
//         .bucket(bucket)
//         .file(originalFile)
//         .copy(storage.bucket(bucket).file(newFile));

//         console.log(
//         `gs://${bucket}/${originalFile} copied to gs://${bucket}/${newFile}`
//         );

//         copyFile().catch(console.error);
// }
    
//   await storage
//       .bucket(bucket)
//       .file(originalFile)
//       .copy(storage.bucket(bucket).file(newFile));

//     console.log(
//       `gs://${bucket}/${originalFile} copied to gs://${bucket}/${newFile}`
//     );
// }

// function main(
//   srcBucketName = 'template-generator-35e82.appspot.com',
//   srcFilename = 'vib_320480/index.html',
//   destBucketName = 'template-generator-35e82.appspot.com',
//   destFileName = newFolderPath + '/index.html'
// ) {
//   async function copyFile() {
//     // Copies the file to the other bucket
//     await storage
//       .bucket(srcBucketName)
//       .file(srcFilename)
//       .copy(storage.bucket(destBucketName).file(destFileName));

//     console.log(
//       `gs://${srcBucketName}/${srcFilename} copied to gs://${destBucketName}/${destFileName}`
//     );
//   }

//   copyFile().catch(console.error);
//   // [END storage_copy_file]
// }
// main(...process.argv.slice(2));



// for (const originalFile of fileNamesToCopy) {

//     function main( 
//         srcBucketName = bucket,
//         srcFilename = originalFolder+originalFile,
//         destBucketName = bucket,
//         destFileName = newFolderPath+originalFile
//     ){      
//         async function copyFile(){
//         await storage
//         .bucket(srcBucketName)
//         .file(srcFilename)
//         .copy(storage.bucket(destBucketName).file(destFileName));

//         console.log(
//         `gs://${srcBucketName}/${destBucketName} copied to gs://${srcBucketName}/${destFileName}`
//         );
//     }

//         copyFile().catch(console.error);
//     }
    
// }



