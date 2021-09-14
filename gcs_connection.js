const {Storage} = require('@google-cloud/storage');
const gcStorage  = new Storage({
    keyFilename: 'gcs_key.json'
});

module.exports = gcStorage;