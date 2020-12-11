var fs = require('fs');
const axios = require('axios').default
const config = require('./config.js')
const unzipper = require('unzipper')
var download = false;

function main(args){
setInterval(async () => {
    if (download == false) {
    var version = config.getConfig('version');
    download = true;
    axios.get('http://mujaca.de/versions/uploaderv2.json')
    .catch((error) => {
        // console.error(error)
    })
    .then(async (response) => {
        if(version !== response.data.version){
            console.log("A new Version is available!")
            console.log(`Download it from here: ${response.data.download}`)
        }
    })
}
}, 1000);
}

exports.updater = main;