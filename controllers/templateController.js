'use strict';

const firebase = require('../db');
const createTemplate = require('../models/createTemplate');
const firestore = firebase.firestore();

const addTemplate = async(req,res,next)=>{
    try {
        const data = req.body;
        await firestore.collection('temp_gen').doc(data.id).set(data);
        res.send('created successfully.')
        
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getAllTemplates = async(req, res, next)=>{
    try {
        const temp_data = await firestore.collection('temp_gen');
        const data = await temp_data.get()
        let template_list = [];
        
        if(data.empty){
            res.status(404).send('List not found');
        }else{
            data.forEach(item => {
                const template = new createTemplate(
                    item.id,
                    item.data().temp_name,
                    item.data().ad_size,
                    item.data().temp_form,
                    item.data().file_new_path,
                    item.data().file_ori_path
                );
                template_list.push(template)
            });
            res.send(template_list)
        }
        
    } catch (error) {
        res.status(400).send(error.message);
    }
}


const getTemplate = async(req, res, next)=>{
    try {
        const id = req.params.id;
        const template = await firestore.collection('temp_gen').doc(id);       
        const data = await template.get(); 
        if(!data.exists){
            res.status(404).send('template not found');         
        }else{
            res.send(data.data());
        }     
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = {
    addTemplate,
    getAllTemplates,
    getTemplate
}