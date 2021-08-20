const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const confg = require('./config')
const data = require('./templateData.json')

const app = express()

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

//Routes
app.get('/', (request, response) => {
  response.send('Home')
})


app.get('/api/temp-name', (request, response) => {
  response.send(data)
})

// dynamic param (the value that selected)
app.get('/api/temp-name/:id', (request, response) => {

  const template = data.templates.find(t => t.id === parseInt(request.params.id))
  if(!template){
    response.status(404).send('template not found')
  }else{
    response.send(template)
  }
})

app.post('/api/temp-name', (request, response) => {
  const template ={
    id: templates.length +1,
    name: request.body.temp_name,
  }
  templates.push(template)
  response.send(template)

})




app.listen(config.port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})