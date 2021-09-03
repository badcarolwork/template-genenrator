const express = require('express');
const app = express();

const add = (a :number, b:number) =>{
    return a+b
}

app.get('/', (req:any) =>{
    add(1,2)
})


app.listen(3001, () =>{
    console.log('started')
})