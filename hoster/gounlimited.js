var fs = require('fs');
const request = require('request');
 

class gounlimited{
    constructor (file, api_key){
        if (api_key !== undefined && file !== undefined) {
            this.api_key = api_key;
            this.file = file;
        }
    }

    init(){
        return new Promise(async (resolve, reject) => {
            if (this.api_key !== undefined && this.file !== undefined) {
                this.uploadUrl = await this.getLink().catch((error) => {reject(error);});
                if (this.uploadUrl !== false) {
                    this.result = await this.upload().catch((error) => {reject(error);})
                    resolve(this.result);
                }else{
                    reject(false)
                }
                }else{
                    reject(false);
                }
            });
    }

    getLink() {
        return new Promise((resolve, reject) => {
            var options = {
                url: 'https://api.gounlimited.to/api/upload/server?key=' + this.api_key,
                method: 'GET'
            }
            request(options, function(error, response, body) {
                if (body !== undefined) {
                    resolve(JSON.parse(body).result);
                }else{
                    reject(error)
                }
            });
        });
    }

    upload() {
        return new Promise((resolve, reject) => {
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
                    reject(err)
                } else {
                    var list = body.split('"');
                    for (let index = 0; index < list.length; index++) {
                        const element = list[index];
                        if (element == 'fn') {
                            var streamcode = list[index + 1].replace('>', '');
                            streamcode = streamcode.replace('</textarea><textarea name=', '');
                            resolve('https://gounlimited.to/embed-' + streamcode + '.html')
                        }else{
                            reject(false)
                        }
                    }
                }
            });
        });
    };
}

exports.upload = gounlimited;