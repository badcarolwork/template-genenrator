'use strict';
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const gcStorage = require('../gcs_connection');

const SCOPES = ['https://www.googleapis.com/auth/drive'];
const auth = new google.auth.GoogleAuth({
  keyFile: '../gdrive_auth.json',
  scopes: SCOPES,
});
const bucket = gcStorage.bucket('template-generator-35e82.appspot.com');


const createAndUploadFiles = async (auth) =>{
  const drive = google.drive({version:'v3', auth})

  var fileMetadata = {
    'name': 'photo.jpg',
    parents: ['1PyNq5_KrhH9muhS5xnDwfkki-xY_EqNf']
  };
  var media = {
    mimeType: 'image/jpeg',
    body: fs.createReadStream('file/320x300.jpg')
  };
  drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id'
  }, function (err, file) {
    if (err) {
      // Handle error
      console.error(err);
    } else {
      console.log('File Id: ', file.id);
    }
  });
}


const handleGetFiles = (req, res) =>{
  let selectedFolder = req.params.id;
  // console.log(selectedFolder)
  // const file = bucket.file(selectedFolder)
  bucket.getFiles({prefix: `${selectedFolder}/`}, (err, files) => {
    if (!err) {
      // files is an array of File objects.
      // console.log(files.file)
      files.forEach(file => {
        console.log(file.name)
      });
    }
  });
}

module.exports = {
  createAndUploadFiles,
  handleGetFiles
}