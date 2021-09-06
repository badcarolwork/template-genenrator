'use strict';

const template_api = "http://localhost:3001/api/template/1"
const file_api = "http://localhost:3001/create/file"
const getFormContianer = document.getElementById("get_form")


async function getapi(url) {
    // Storing response
    const response = await fetch(url);

    // Storing data in form of JSON
    var data = await response.json();
    if (response) {
        show(data);
    }

}

getapi(template_api);

function show(data) {

    const d = data.temp_form;
    let content = ''
    // console.log(d)

    d.forEach((item) => {
        if (item === 'image_backup' || item === 'image_banner') {
            content += `<label for='${item}'>${item}</label><input name='${item}' type='file' id='${item}' value=''><br/>`
        }else{
            content += `<label for='${item}'>${item}</label><input name='${item}' type='text' id='${item}' value=''><br/>`
        }
        
    })
    content += ` <input type="submit" id="handle_submit">`

   
    getFormContianer.innerHTML = content
}

async function handleForm(e) {
    e.preventDefault();
    let dataForm = new FormData(e.target)

    // console.log(dataForm)
    
    // console.log(dataForm.file)

   
    // console.log(img1)
    // console.log(img2)
    let obj = {}
    dataForm.forEach((value, key) => {
        obj[key] = value
        if( typeof value === 'object'){
           console.log(value.name)
           obj[key] = value.name +'_name'
        }
    });
    
    let data = JSON.stringify(obj);
    
    // console.log(dataForm) 
    // dataForm.append("data", data);
    let img1 = document.getElementById("image_backup").files[0];
    dataForm.append("image_backup", img1);
    let img2 = document.getElementById("image_banner").files[0];
    dataForm.append("image_banner", img2);

    // console.log(dataForm.get('image_backup_file'))
    // console.log(dataForm.get('data'))
    
   await fetch(file_api, {
        method: 'POST',    
        body: dataForm
        
    }).then((res)=>{
        return res.json();
    }).then((data)=>{
        console.log(data)
        console.log('api err: '+ data);
    }).catch((err) =>{
        console.log('api err: '+ err)
    })
    
}

getFormContianer.addEventListener('submit', handleForm)
