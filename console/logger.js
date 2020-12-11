const fs = require("fs");

var log = console.log;
var error = console.error;
var debug = console.debug;

if(!fs.existsSync('./logs/')) fs.mkdirSync('./logs/')
if(fs.existsSync('./logs/latest.log')) fs.unlinkSync('./logs/latest.log')

console.log = function () {
    var first_parameter = arguments[0];
    var other_parameters = Array.prototype.slice.call(arguments, 1);
    fs.appendFileSync('./logs/latest.log', [formatConsoleDate(new Date(), "INFO") + first_parameter].concat(other_parameters) + "\n");
    log.apply(console, [formatConsoleDate(new Date(), "INFO") + first_parameter].concat(other_parameters));
};

console.debug = function () {
    var first_parameter = arguments[0];
    var other_parameters = Array.prototype.slice.call(arguments, 1);
    fs.appendFileSync('./logs/latest.log', [formatConsoleDate(new Date(), "DEBUG") + first_parameter].concat(other_parameters) + "\n");
};

console.error = function () {
    var first_parameter = arguments[0];
    var other_parameters = Array.prototype.slice.call(arguments, 1);
    fs.appendFileSync('./logs/latest.log', [formatConsoleDate(new Date(), "ERROR") + first_parameter].concat(other_parameters) + "\n");
    error.apply(console, [formatConsoleDate(new Date(), "ERROR") + "An error occured. Please check the latest.log"]);
};

console.log("Initialized Log File")

function formatConsoleDate (date, type) {
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var milliseconds = date.getMilliseconds();

    return '[' + type + ' ' +
           ((hour < 10) ? '0' + hour: hour) +
           ':' +
           ((minutes < 10) ? '0' + minutes: minutes) +
           ':' +
           ((seconds < 10) ? '0' + seconds: seconds) +
           '] ';
}