const express = require('express');
const cors = require('cors'); 
const bodyParser = require('body-parser')
const config = require('./config')
const createTemplateRoutes = require('./routes/createTemplate-routes');

const app = express()

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());


app.use('/api', createTemplateRoutes.routes);


app.listen(config.port, () => {
    console.log(`Example app listening at http://localhost:${config.port}`)
  })
