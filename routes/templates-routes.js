const express = require('express');
const {addTemplate, getAllTemplates, getTemplate } = require('../controllers/templateController');

const router = express.Router();

router.post('/template', addTemplate);
router.get('/templates', getAllTemplates);
router.get('/template/:id', getTemplate);

module.exports={
    routes: router
}