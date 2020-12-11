const fs = require('fs');

function getConfig(key){
    if (key == undefined) {
        return fs.readFileSync('./config.json')
    }else{
        return require('../config.json')[key];
    }
}

function writeConfig(key, value){
    if (key !== undefined && value !== undefined) {
        var config = require('../config.json');
        config[key] = value;
        fs.writeFileSync('./config.json', JSON.stringify(config));
    }else{
         console.error('Reference Error at calling writeConfig: key or value is not defined!')
        return null
    }
}

function checkConfig(){
    if(!fs.existsSync('./config.json')){
        var config = {
            "hoster": [],
            "version": "1.0",
            "generateWordpress": true,
            "results":"./results/"
        }
        fs.writeFileSync('./config.json', JSON.stringify(config))
    }
    console.log("Config loaded")
}
checkConfig();

exports.getConfig = getConfig;
exports.writeConfig = writeConfig;