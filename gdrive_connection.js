const {google} = require('googleapis')

const KEYFILEPATH = './gdrive_auth.json'
const SCOPES = ['https://www.googleapis.com/auth/drive']

const auth = new google.auth.GoogleAuth({
        keyFile: KEYFILEPATH,
        scopes: SCOPES
})


module.exports = auth;