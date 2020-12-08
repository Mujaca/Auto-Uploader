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
    axios.get('http://mujaca.de/versions/uploader.json')
    .catch((error) => {
        // console.error(error)
    })
    .then(async (response) => {
        if(version !== response.data.version){
            var url = response.data.download;
            const file = await require('axios')({
                url,
                method: 'GET',
                responseType: 'stream'
            })
            const writer = fs.createWriteStream('./update.zip');
            file.data.pipe(writer)
            fs.createReadStream('./update.zip')
            .pipe(unzipper.Extract({ path: './' })).on('finish', async () => {
                config.writeConfig('version', response.data.version);
                fs.unlink('./update.zip', (err) => {
                    if(err) throw err;
                })
                console.log("Update installed. Restarting ...")
                var cmd = "node " + './';
                args.forEach((arg) => {
                    cmd = cmd + " " + arg;
                })
                var exec = require('child_process').exec;
                await exec('npm install', function() {

                })
                exec(cmd, function () {
                  process.kill();
                });
            });
            
        }
    })
}
}, 60000);
}

exports.updater = main;