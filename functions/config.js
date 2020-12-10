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

console.log("Config loaded")

exports.getConfig = getConfig;
exports.writeConfig = writeConfig;