var fs = require('fs');
const request = require('request');
 

class vidoza {
    constructor (file, api_key){
        if (api_key !== undefined && file !== undefined) {
            this.api_key = api_key;
            this.file = file;
        }
    }
    init() {
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

    getLink(api_key) {
        return new Promise(resolve => {
            var options = {
                url: 'https://api.vidoza.net/v1/upload/http/server',
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + this.api_key,
                    'cache-control': 'no-cache',
                    'Accept': 'application/json'
                }
            }
    
            request(options, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    var res = JSON.parse(body);
                    resolve(res.data);
                }
            });
        });
    }
    
    upload(uploadUrl, file) {
        return new Promise(resolve => {
    
            const options = {
                method: "POST",
                url: this.uploadUrl.upload_url,
                headers: {
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'multipart/form-data'
                },
                formData: {
                    "is_xhr": 'true',
                    "sess_id": this.uploadUrl.upload_params.sess_id,
                    "file": fs.createReadStream(this.file)
                }
            };
    
            request(options, function(err, res, body) {
                if (err) {
                    console.error(err)
                    resolve("err")
                } else {
                    resolve("https://vidoza.net/embed-" + JSON.parse(body).code + ".html");
                }
            });
        });
    };
}


exports.upload = vidoza;