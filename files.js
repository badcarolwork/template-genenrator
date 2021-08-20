const replace = require('replace-in-file');


const index = {
    files: './file/index.html',
    from: ['_ccsfilepath', '_exitImgPath', '_bgImgPath'],
    to: ['320480.css', '320480.jpg', '320480.jpg'],
};
const vidTrack = {
    files: './file/basicVideo.js',
    from: ['_basicUrlPath', '_vidCssPath', '_vidFilePath', '_fldSrc', '_fldType', '_fldCat', '_fldU3', '_fldU4'],
    to: ['https://www.google.com', 'video_300250_contain-up.css', 'https://gcdn.2mdn.net/videoplayback/id/fd772380050894dc/itag/15/source/doubleclick/ratebypass/yes/mime/video%2Fmp4/acao/yes/ip/0.0.0.0/ipbits/0/expire/3762143790/sparams/id,itag,source,ratebypass,mime,acao,ip,ipbits,expire/signature/826C70026CF75504107AEC9D1C28634339C5E7D6.573C2C0D99BAF1D2306F139A3407C5703185478A/key/ck2/file/file.mp4', '', '', '', 'PMP', ''],
};

const bsTrack = {
    files: './file/basicTracking.js',
    from: ['_lpUrlPath', '_fldSrc', '_fldType', '_fldCat', '_fldU3', '_fldU4'],
    to: ['https://www.google.com', '', '', '', 'PMP', ''],
};

replace(index)
    .then(results => {
        console.log('Replacement results:', results);
    })
    .catch(error => {
        console.error('Error occurred:', error);
    });

replace(vidTrack)
    .then(results => {
        console.log('Replacement results:', results);
    })
    .catch(error => {
        console.error('Error occurred:', error);
    });

replace(bsTrack)
    .then(results => {
        console.log('Replacement results:', results);
    })
    .catch(error => {
        console.error('Error occurred:', error);
    });