var fs = require('fs');
const request = require('request');
 

class nxload{
    constructor (api_user, api_key, file){
        if (api_user !== undefined && api_key !== undefined && file !== undefined) {
            this.api_key = api_key;
            this.api_user = api_user;
            this.file = file;
        }
    }
    init(){
        return new Promise(async (resolve) => {
            if (this.api_user !== undefined && this.api_key !== undefined && this.file !== undefined) {
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
                url: `https://api.nxload.com/v2/upload/server?user=${this.api_user}&token=${this.api_key}`,
                method: 'GET',
                json: true
            }
            request(options, function(error, response, body) {
                if(body.success){
                resolve(body.data.url);
                }else{
                    resolve(false);
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
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'multipart/form-data'
                },
                formData: {
                    "file": fs.createReadStream(this.file)
                }
            };
            request(options, function(err, res, body) {
                if (err) {
                     console.error(err);
                    resolve("err")
                } else {
                    resolve(JSON.parse(body).data.embed);
                     console.log("Nxload done")
                }
            });
        });
    };
}

exports.nxload = nxload;