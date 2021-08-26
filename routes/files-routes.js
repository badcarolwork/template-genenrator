const express = require('express');
const {replaceValue } = require('../controllers/filesController');

const router = express.Router();

router.post('/file', replaceValue);

module.exports={
    routes: router
}