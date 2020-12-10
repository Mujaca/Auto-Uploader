var fs = require('fs');
const request = require('request');
 

class nxload{
    constructor (file, api_key, api_user){
        if (api_user !== undefined && api_key !== undefined && file !== undefined) {
            this.api_key = api_key;
            this.api_user = api_user;
            this.file = file;
        }
    }
    init(){
        return new Promise(async (resolve, reject) => {
            if (this.api_user !== undefined && this.api_key !== undefined && this.file !== undefined) {
            this.uploadUrl = await this.getLink().catch((error) => {reject(error)});
            if (this.uploadUrl !== false) {
                this.result = await this.upload().catch((error) => {reject(error)})
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
                url: `https://api.nxload.com/v2/upload/server?user=${this.api_user}&token=${this.api_key}`,
                method: 'GET',
                json: true
            }
            request(options, function(error, response, body) {
                if(error) reject(error);
                if(!error && body.success){
                resolve(body.data.url);
                }else{
                    reject(false);
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
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'multipart/form-data'
                },
                formData: {
                    "file": fs.createReadStream(this.file)
                }
            };
            request(options, function(err, res, body) {
                if (err) {
                    reject(err)
                } else {
                    resolve(JSON.parse(body).data.embed);
                }
            });
        });
    };
}

exports.upload = nxload;