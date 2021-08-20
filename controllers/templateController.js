'use strict';

const firebase = require('../db');
const createTemplate = require('../models/createTemplate');
const firestore = firebase.firestore();

const addTemplate = async(req,res,next)=>{
    try {

        const data = req.body;
        await firestore.collection('temp_gen').doc().set(data);
        res.send('created successfully.')
        
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getTemplate = async(req,res,next)=>{
    try {
        const data = req.body;
        await firestore.collection('temp_gen').doc().set(data);
        res.send('created successfully.')
        
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
    addTemplate
}