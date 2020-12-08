var fs = require('fs');
const request = require('request');


class jetload {
    constructor(file, api_key){
        if (api_key !== undefined && file !== undefined) {
            this.api_key = api_key;
            this.file = file;
        }
    }

    async init(){
        return new Promise(async (resolve, reject) => {
            if (this.api_key !== undefined && this.file !== undefined) {
                this.uploadUrl = await this.getUploadLink().catch((error) => {
                    if(error) this.uploadUrl = "error"; 
                    console.log(error)
                });
                if(this.uploadUrl !== "error"){this.result = await this.upload(this.uploadUrl)}else{this.result = "err"}
                resolve(this.result);
            }else{
                resolve(false);
            }
        })
    }

    async getUploadLink(){
        return new Promise((resolve, reject) => {
        var options = {
            url: `https://jetload.net/api/v2/upload/${this.api_key}`,
            method: 'GET'
        }
        
        request(options, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    const data = JSON.parse(body);
                    resolve(body);
                }else{
                    reject(error);
                }
        });
        });
        }

        async upload() {
            return new Promise(resolve => {
            var data = JSON.parse(this.uploadUrl);
            var url = data.hostname + data.path;
            var user_id = data.upload_id
            
            var file = fs.createReadStream(this.file)
            var req = request.post(url, function (err, response, body) {
              if (err) {
                resolve("error")
              } else {
                if (body.includes("https://jetload.net")) {
                    resolve(body);
                }else{
                    resolve("error");
                }
            }
            });
            var form = req.form();
            form.append('file', file);
            form.append('upload_id', user_id.user_id);
            });
        }
}


exports.upload = jetload;