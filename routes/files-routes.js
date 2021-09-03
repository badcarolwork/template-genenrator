const express = require('express');
const multer = require('multer');

const router = express.Router();
const {loopFiles } = require('../controllers/filesController');


router.post('/file', loopFiles);

module.exports={
    routes: router
}