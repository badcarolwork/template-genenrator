const express = require('express');
const router = express.Router();

const {startCreatefiles} = require('../controllers/uploadServiceController');


router.post('/file', startCreatefiles);

module.exports={
    routes: router
}