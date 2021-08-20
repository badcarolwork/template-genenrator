const firebase = require('firebase');
const confg = require('./config');

const db = firebase.initializeApp(confg.firebaseConfig)

module.exports = db;