var fs = require('fs');
const request = require('request');
 

class doodstream{
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
            this.result = await this.upload()
            resolve(this.result);
            }else{
                resolve(false);
            }
        });
    }
    getLink() {
        return new Promise(resolve => {
            var options = {
                url: 'https://doodapi.com/api/upload/server?key=' + this.api_key,
                method: 'GET'
    
            }
            request(options, function(error, response, body) {
                resolve(JSON.parse(body).result);
            });
        });
    }

    upload() {
        return new Promise(resolve => {
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
                console.log(this)
                if (err)  console.log(err);
                var list = body.split('"');
                for (let index = 0; index < list.length; index++) {
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
        return new Promise(resolve => {
            const options = {
                url: `https://doodapi.com/api/file/info?key=${this.api_key}&file_code=${filecode}`,
                method: "GET"
            };
            request(options, function(err, res, body) {
                if (!err && res.statusCode == 200) {
                    var res = JSON.parse(body);
                    resolve(res.result[0].protected_embed);
                } else {
                    resolve("err")
                }
            })
        })
    }

}



exports.doodstream = doodstream;