const uppy = require('@uppy/core');
const XHRUpload = require('@uppy/xhr-upload');
const dashboard = require('@uppy/dashboard');
const webcam = require('@uppy/webcam');

const newUppy = new uppy()
    .use(dashboard, {
        inline: true,
        target: '#drag-drop-area'
    })
    .use(XHRUpload, {
        endpoint: 'http://localhost:3000/image',
        fieldName: 'photo',
        formData: true
    })
    .use(webcam, {target: dashboard});

newUppy.on('complete', res => {
    console.log(res.successful);
});

module.exports = newUppy
