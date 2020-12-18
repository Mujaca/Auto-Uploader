const fs = require("fs")
class upload{
    constructor(file){
        this.file = file;
    }
    async upload(){
        return new Promise(async (resolve, reject) => {
            var hoster = await this.getHoster();
            var h = config.getConfig("hoster");
            var links = {};
            var done = 0;
            h.forEach(async (singlehoster) => {
                var u = hoster[singlehoster.name.toLowerCase()]
                var prep = new u.upload(this.file, singlehoster.api_key, singlehoster.api_user)
                for (let index = 0; index < 20; index++) {
                    links[singlehoster.name.toLowerCase()] = await prep.init().catch((error) => {links[singlehoster.name.toLowerCase()] = null; if(error) console.error(error)});
                    if(links[singlehoster.name.toLowerCase()] !== null && links[singlehoster.name.toLowerCase()] !== undefined) {index = 22;}else{console.log(`Error at Uploading to ${singlehoster.name.toLowerCase()}. Restarting the Upload ...`)}
                }
                done++;
                if(h.length == done) resolve(links)
            })
        })
    }
    getHoster(){
        return new Promise((resolve, reject) => {
            fs.readdir('./hoster/', (err, files) => {
                if(err) reject(err);
                var hoster = {};
                files.forEach((file) => {
                    if(file.endsWith(".js")){
                        var prefix = file.split(".")[0].toLowerCase();
                        hoster[prefix] = require(`../hoster/${file}`)
                    }
                })
                resolve(hoster);
            })
        })
    }
}

exports.upload = upload;