const express = require('express');
const cors = require('cors'); 
const config = require('./config')
const templates = require('./routes/templates-routes');
const files = require('./routes/files-routes');

const app = express()

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'))
app.use('/api', templates.routes);
app.use('/create', files.routes);


app.listen(config.port, () => {
    console.log(`Example app listening at http://localhost:${config.port}`)
  })
