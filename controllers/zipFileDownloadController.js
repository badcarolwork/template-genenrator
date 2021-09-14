'use strict';

const gcStorage = require('../gcs_connection')
const zipBucket = require('zip-bucket')(gcStorage);
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

const zipFilesUpload = () =>{
  zipBucket({ fromBucket, fromPath, toBucket, toPath, keep, mapper, metadata })
    .then(function yourNextTask({fromBucket, fromPath, toBucket, toPath, keep, metadata, manifest}))
}

module.exports = {
  getTemplateElements,
  startCreatefiles
}