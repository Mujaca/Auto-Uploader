const fs = require('fs');
const { version } = require('nexe');

function getConfig(key){
    if (key == undefined) {
        return fs.readFileSync('./config.json')
    }else{
        return JSON.parse(fs.readFileSync('./config.json'))[key];
    }
}

function writeConfig(key, value){
    if (key !== undefined && value !== undefined) {
        var config = JSON.parse(fs.readFileSync('./config.json'));
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
            "results":"./results/",
            "license": ""
        }
        fs.writeFileSync('./config.json', JSON.stringify(config))
    }
    if(!fs.existsSync('./watching.json')) fs.writeFileSync('./watching.json', JSON.stringify([]))
    writeConfig("version", "1.1.0")
    console.log("Config loaded")
}
checkConfig();

exports.getConfig = getConfig;
exports.writeConfig = writeConfig;