async function boot(){
    //Loads the Timestamps and the Log File Writing
    require('./console/logger')
    //Loads up the Error & Shutdown Handler
    require('./console/error')
    //Startup the Console Menu
    const {menu} = require("./console/index");
    new menu();
    //Loads the config Helper
    const config = require('./functions/config')
    global.config = config;
    //Loads the Filewatcher
    const {watcher} = require("./uploader/index")
    global.watcher = watcher;
    new watcher('./');
}

boot();