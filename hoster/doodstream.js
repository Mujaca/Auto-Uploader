const { rejects } = require('assert');
var fs = require('fs');
const request = require('request');
 

class doodstream{
    constructor (file, api_key){
        if (api_key !== undefined && file !== undefined) {
            this.api_key = api_key;
            this.file = file;
        }
    }
    init(){
        return new Promise(async (resolve, reject) => {
            if (this.api_key !== undefined && this.file !== undefined) {
                this.uploadUrl = await this.getLink().catch((error) => {reject(error);})
                this.result = await this.upload().catch((error) => {reject(error)})
                resolve(this.result);
            }else{
                resolve(false);
            }
        });
    }
    getLink() {
        return new Promise((resolve, reject) => {
            var options = {
                url: 'https://doodapi.com/api/upload/server?key=' + this.api_key,
                method: 'GET'
    
            }
            request(options, function(error, response, body) {
                if (error) reject(error)
                if (!error) resolve(JSON.parse(body).result);
            });
        });
    }

    upload() {
        return new Promise((resolve, reject) => {
            var main = this;
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
            request(options, async function(err, res, body) {
                if (err) {console.error(err);reject(err)}
                var list = body.split('"');
                if(!err)for (let index = 0; index < list.length; index++) {
                    const element = list[index];
                    if (element == 'fn') {
                        var streamcode = list[index + 1].replace('>', '');
                        streamcode = streamcode.replace('</textarea><textarea name=', '');
                        var protectedCode = await main.getProtectedLink(streamcode)
                        resolve('https://dood.to' + protectedCode);
                    }
                }
            });
        });
    };

    getProtectedLink(filecode) {
        return new Promise((resolve, reject) => {
            const options = {
                url: `https://doodapi.com/api/file/info?key=${this.api_key}&file_code=${filecode}`,
                method: "GET"
            };
            request(options, function(err, res, body) {
                if (!err && res.statusCode == 200) {
                    var res = JSON.parse(body);
                    resolve(res.result[0].protected_embed);
                } else {
                    reject(err)
                }
            })
        })
    }

}



exports.upload = doodstream;