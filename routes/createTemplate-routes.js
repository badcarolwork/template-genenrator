const express = require('express');
const {addTemplate } = require('../controllers/templateController');

const router = express.Router();

router.post('/template', addTemplate);

module.exports={
    routes: router
}