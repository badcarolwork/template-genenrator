const {Storage} = require('@google-cloud/storage');
const gcStorage  = new Storage({
    keyFilename: 'gcs_key.json'
});

// const db = firebase.initializeApp(config.firebaseConfig);


module.exports = gcStorage;