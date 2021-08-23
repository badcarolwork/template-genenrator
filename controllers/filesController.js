'use strict';

const firebase = require('../db');
const storage = firebase.storage();

const storageRef = storage.ref();

const getFilePath = async(req,res,next)=>{
    const listRef = storageRef.child();

    console.log(listRef)

}

module.exports = {
    getFilePath
}