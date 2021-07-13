const fs = require('fs')
const readline = require("readline");
const config = require('./functions/config')

//Start Arguments
//var args = process.argv.slice(2);
async function boot(){
    //Loads the Timestamps and the Log File Writing
    require('./console/logger')
    //Loads up the Error & Shutdown Handler
    require('./console/error')
    //Startup the Console Menu
    const {menu} = require("./console/index");
    new menu();
    //Loads the config Helper
    global.config = config;
    //Loads the Filewatcher
    const watching = JSON.parse(fs.readFileSync('./watching.json'));
    const {watcher} = require("./uploader/index")
    global.watcher_array = [];
    watching.forEach((folder) => {
        watcher_array.push(new watcher(folder));
    })
    //Loads up the Auto Updater
    const autoupdater = require("./functions/autoupdate");
    autoupdater.updater();
    //Everything loaded!
    setTimeout(() => {
        console.log("Mujaca`s AutoUploader")
    }, 1000);
}

boot();