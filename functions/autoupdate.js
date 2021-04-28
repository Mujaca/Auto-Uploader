var fs = require('fs');
const axios = require('axios').default
const config = require('./config.js')
var download = false;

function main(args){
setInterval(async () => {
    if (download == false) {
    var version = config.getConfig('version');
    download = true;
    axios.get('https://mujaca.de/api/project/version/1')
    .catch((error) => {
        // console.error(error)
    })
    .then(async (response) => {
        if(version !== response.data){
            console.log("A new Version is available!")
            console.log(`Download it from here: https://mujaca.de/projects/current/1`)
        }
    })
}
}, 1000);
}

exports.updater = main;