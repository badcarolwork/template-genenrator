const express = require('express');
const cors = require('cors'); 
const config = require('./config')
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
const app = express()

const templates = require('./routes/templates-routes');
const files = require('./routes/files-routes');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));  
app.use(upload.array()); 


app.use(express.static('public'))
app.use('/api', templates.routes);
app.use('/create', files.routes);


app.listen(config.port, () => {
    console.log(`Example app listening at http://localhost:${config.port}`)
  })
