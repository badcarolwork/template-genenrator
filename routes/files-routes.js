const express = require('express');
const {getFilePath } = require('../controllers/filesController');

const router = express.Router();

router.get('/file', getFilePath);

module.exports={
    routes: router
}