const {Storage} = require('@google-cloud/storage');
const gcStorage  = new Storage({
    keyFilename: 'template-generator-35e82-be49740e7c14.json'
});

// const db = firebase.initializeApp(config.firebaseConfig);


module.exports = gcStorage;