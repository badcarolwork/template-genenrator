const express = require('express');
const cors = require('cors'); 
const bodyParser = require('body-parser')
const config = require('./config')
const templates = require('./routes/templates-routes');
const files = require('./routes/files-routes');

const app = express()

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());


app.use('/api', templates.routes);
app.use('/file', files.routes);


app.listen(config.port, () => {
    console.log(`Example app listening at http://localhost:${config.port}`)
  })
