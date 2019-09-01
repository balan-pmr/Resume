// Change hostName value to '' for local enviroment
var hostName = window.location.host
//hostName = ''

function isEmailAddress(str) {
    var pattern =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return pattern.test(str);  // returns a boolean 
 }
 

function switchDescription (){
    console.log('switching description.')
    if(showDescription){s
        document.getElementsByName('lbltipAddedComment')[0].innerHTML = 'Show Descriptions'
        document.getElementsByName('lbltipAddedComment')[1].innerHTML = 'Show Descriptions'
        try{
        [].forEach.call(document.getElementsByClassName('project-content'), (element) => {
            element.setAttribute("style", "display:none;")
            });									
        }catch(e){ }
        showDescription = false;
    }else{
       document.getElementsByName('lbltipAddedComment')[0].innerHTML = 'Hide Descriptions'
       document.getElementsByName('lbltipAddedComment')[1].innerHTML = 'Hide Descriptions'     
        try{
            [].forEach.call(document.getElementsByClassName('project-content'), (element) => {
                element.setAttribute("style", "display: block;")
            });
        }catch(e){ }					
        showDescription = true;
    }
    window.location="#projects";
}


async function getVisitCounter(){

    console.log('Getting visit counter...')

    if(hostName===''){
        console.log('Local env, not http request executed.')
        return JSON.parse('{"visits":-1000}')
    }

    return await 
    fetch(url)
    .then( async function ( response ){
            return response.text()
    }).then(function (text) {
            return JSON.parse(text);
    });
        
}


async function sendInformation(obj){

    console.log('Sending contact information...')
    console.log(obj)

    if(hostName===''){
        console.log('Local env, not http request executed.')
        return JSON.parse('{"status":"ok"}')
    }

    return await fetch(
        url,
        { method: 'POST', body: JSON.stringify(obj) }
    ).then(async function (response) {
        return response.text()
    }).then(function (text) {
        return JSON.parse( text );
    });


}


async function validateContactForm(){
    
    console.log('Validating Information...')
    let name = document.getElementsByName('name')[0].value;
    let email = document.getElementsByName('email')[0].value;
    let subject = document.getElementsByName('subject')[0].value;
    let message = document.getElementsByName('message')[0].value;
    let msg = '';

    // Validating info
    if('' === name ||'' === email ||'' === subject ||'' === message){
        msg = '<font color="red">All data is required.</font>'
    }else
    if(!isEmailAddress(email)){
        msg = '<font color="red">Not a valid email.</font>'
    }else{
        var maxLength = 50;
        name = name.length > maxLength ? name.substring(0, maxLength - 3) + "..." : name;
        email = email.length > maxLength ? email.substring(0, maxLength - 3) + "..." : email;
        subject = subject.length > maxLength ? subject.substring(0, maxLength - 3) + "..." : subject;
        message = message.length > 500 ? message.substring(0, 500 - 3) + "..." : message;
        console.log(name,email,subject,message)
        msg = 'Sending your information...'
        document.getElementById('messageForContact').innerHTML = msg;
        const response = await sendInformation({name,email,subject,message});
        console.log('response is:>',response,"<")
        console.log(response)
        console.log(response.status)
        
        if(response.status === 'ok'){
            msg = `Message was sent successfully.<br> I\'ll contact you soon <font color="red">${name}</font>. <br> Best!`
            clearContactForm();
        }else{
            msg = `A problem has occurred hehe, please  <font color="red">${name}</font> send me a message at balan.pmr@outlook.com. `
        }
    }
    document.getElementById('messageForContact').innerHTML = msg;
    window.location="#contact";
}


function clearContactForm(){
    document.getElementsByName('name')[0].value = '';
    document.getElementsByName('email')[0].value = '';
    document.getElementsByName('subject')[0].value = '';
    document.getElementsByName('message')[0].value = '';    
}

 
 async function load() {
    const counter = await getVisitCounter();
    document.getElementById('visits').innerHTML = counter.visits;
    //switchDescription();
}

var showDescription = false;
let url = 'https://script.google.com/macros/s/AKfycbz_gqJYt02Ag3mFK0sLhjPybYJUG-y8TJPbMEbQrVcOrMubnmI/exec';

window.onload = load;
