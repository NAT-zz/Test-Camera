const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

let fileName;
const storage = multer.diskStorage({
    destination: `${__dirname}/uploads`,
    filename: (req, file, cb) => {
        try{
            fileName = `${file.originalname.split('.')[0]}-${Date.now()}${path.extname(file.originalname).toLowerCase()}`;
            console.log('filename:  ', fileName);
            cb(null, fileName);
        }
        catch(error){
            console.log(error.message);
            cb(error);
        }
    }
});
const uploadImage = multer({storage});

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const nodeWebcam = require('node-webcam');
const opts = {
    //Picture related
    width: 1280,
    height: 720,
    quality: 100,
    // Number of frames to capture
    // More the frames, longer it takes to capture
    // Use higher framerate for quality. Ex: 60
    frames: 1,
    //Delay in seconds to take shot
    //if the platform supports miliseconds
    //use a float (0.1)
    //Currently only on windows
    delay: 0,
    //Save shots in memory
    saveShots: false,
    // [jpeg, png] support varies
    // Webcam.OutputTypes
    output: "jpeg",
    //Which camera to use
    //Use Webcam.list() for results
    //false for default device
    device: false,
    // [location, buffer, base64]
    // Webcam.CallbackReturnTypes

    callbackReturn: "base64",
    verbose: false
}
// const newUppy = require('./src/app');
const port = process.env.PORT || 3000;

const fps = 10;

// const cv = require('opencv4nodejs');
// const wCap = new cv.VideoCapture(0);
// wCap.set(cv.CAP_PROP_FRAME_WIDTH, 300);
// wCap.set(cv.CAP_PROP_FRAME_HEIGHT, 300);


app.use(cors());
app.use(express.static('dist'));

app.get('/', express.static(path.join(__dirname, "./public")));

app.get("/image/:id", (req, res) => {
    const id = req.params.id;
    res.sendFile(path.join(__dirname, `./uploads/${id}`));
  });

// multer
app.post('/upload', uploadImage.single('file'), (req, res) => {
    console.log("#####req: ",req.file);
    if(req.file)
    {
        return res.json({
            msg: 'done uploading image',
            file: req.file.filename
        });
    }

    res.send('Image upload failed');
})

// uppy
// app.post('/image', uploadImage.single('photo'), (req, res) => {
//     console.log(req.file);
//     if(req.file)
//         return res.json({msg: 'done uploading image'});
//     else
//         console.log(req.error);
//     res.send('Image upload failed');
// })
const webcam = nodeWebcam.create(opts);

setInterval(async () => {
    // const frame = wCap.read();
    // const image = cv.imdecode('.jpg', frame).toString('base64');
    // webcam.capture( "test_picture", (err, data) =>{
    // });
    io.emit('image', null);

}, 1000/fps);

server.listen(port, () => {
    console.log(`listening on port ${port}`);
})