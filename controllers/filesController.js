'use strict';

const replace = require('replace-in-file');

const path = "./file/vib_320480"


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
    // console.log(request.body)
    let data = request.body
    response.send(request.body)

    const index = {
        files: path + '/index.html',
        from: ['_bgImgName', '_bannerImgName'],
        to: [data.image_backup, data.image_banner],
    };

    const bsTrack = {
        files: path + '/basicTracking.js',
        from: [ '_fldSrc', '_fldType', '_fldCat', '_fldU3', '_fldU4','_vidFilePath'],
        to: [ data.floodlight_src, data.floodlight_type, data.floodlight_cat, data.floodlight_u3, data.floodlight_u4, data.video_url ]
    };

    replace(bsTrack)
        .then(results => {
            console.log('Replacement results:', results);
        })
        .catch(error => {
            console.error('Error occurred:', error);
        });

    replace(index)
    .then(results => {
        console.log('Replacement results:', results);
    })
    .catch(error => {
        console.error('Error occurred:', error);
    });


}

module.exports = {
    replaceValue,
    handleUploadImages,
    imageFilter
}