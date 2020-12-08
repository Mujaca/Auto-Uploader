const fs = require("fs");

process.stdin.resume();//so the program will not close instantly


//do something when app is closing
process.on('exit', () => {
    console.debug("Programm closed")
    moveLog();
    console.clear();
});

//catches ctrl+c event
process.on('SIGINT', () => {
    console.debug("Programm was shutdown by User")
});

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', () => {
    console.debug("Programm was forceshutdowned")
});
process.on('SIGUSR2', () => {
    console.debug("Programm was forceshutdowned")
});

//catches uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error(error.stack)
});

function moveLog(){
    if(!fs.existsSync('./logs/old/')){
        fs.mkdirSync('./logs/old/')
    }
    var time = new Date();
    var timestring = `${time.getDate()}.${time.getMonth()}.${time.getFullYear()} - ${time.getHours()} ${time.getMinutes()}.log`;
    fs.copyFileSync('./logs/latest.log', `./logs/old/${timestring}`)
}

console.log("Errorhandling loaded!")