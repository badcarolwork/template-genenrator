const express = require('express');

const router = express.Router();
const {replaceValue } = require('../controllers/filesController');


router.post('/file', replaceValue);

module.exports={
    routes: router
}