'use strict';

const replace = require('replace-in-file');

const path = "../file/vib_320480/"


const imageFilter = function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

const handleUploadImages = (request, response)=>{
    console.log(request)
}

const replaceValue = (request, response) =>{
    console.log(request.body)
    response.send(request.body)

    // const index = {
    //     files: path + '/index.html',
    //     from: ['_bgImgName', '_bannerImgName'],
    //     to: [bgImgName, bannerImgName],
    // };

    // const bsTrack = {
    //     files: path + '/basicTracking.js',
    //     from: [ '_fldSrc', '_fldType', '_fldCat', '_fldU3', '_fldU4','_vidFilePath'],
    //     to: [ fldSrc, fldType, fldCat, fldU3, fldU4, vidSrc ]
    // };

    // replace(bsTrack, index)
    //     .then(results => {
    //         console.log('Replacement results:', results);
    //     })
    //     .catch(error => {
    //         console.error('Error occurred:', error);
    //     });


}

module.exports = {
    replaceValue,
    handleUploadImages,
    imageFilter
}