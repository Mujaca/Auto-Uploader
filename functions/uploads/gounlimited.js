var fs = require('fs');
const request = require('request');
 

class gounlimited{
    constructor (api_key, file){
        if (api_key !== undefined && file !== undefined) {
            this.api_key = api_key;
            this.file = file;
        }
    }

    init(){
        return new Promise(async (resolve) => {
            if (this.api_key !== undefined && this.file !== undefined) {
                this.uploadUrl = await this.getLink();
                if (this.uploadUrl !== false) {
                    this.result = await this.upload()
                    resolve(this.result);
                }else{
                    resolve(false)
                }
                }else{
                    resolve(false);
                }
            });
    }

    getLink() {
        return new Promise(resolve => {
            var options = {
                url: 'https://api.gounlimited.to/api/upload/server?key=' + this.api_key,
                method: 'GET'
            }
            request(options, function(error, response, body) {
                if (body !== undefined) {
                    resolve(JSON.parse(body).result);
                }else{
                    resolve(false)
                }
            });
        });
    }

    upload() {
        return new Promise(resolve => {
            const options = {
                method: "POST",
                url: this.uploadUrl,
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                formData: {
                    "type": "submit",
                    "api_key": this.api_key,
                    "file": fs.createReadStream(this.file)
                }
            };
            request(options, function(err, res, body) {
                if (err) {
                     console.error(err);
                    resolve("err")
                } else {
                    var list = body.split('"');
                    for (let index = 0; index < list.length; index++) {
                        const element = list[index];
                        if (element == 'fn') {
                            var streamcode = list[index + 1].replace('>', '');
                            streamcode = streamcode.replace('</textarea><textarea name=', '');
                            resolve('https://gounlimited.to/embed-' + streamcode + '.html');
                             console.log("GoUnlimited done")
                        }
                    }
                }
            });
        });
    };
}

exports.gounlimited = gounlimited;