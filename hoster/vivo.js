var fs = require('fs');
const request = require('request');
 

class upload{
    constructor (file, api_key){
        if (api_key !== undefined && file !== undefined) {
        this.api_key = api_key;
        this.file = file;
    }
    }
    init (){
        return new Promise(async (resolve, reject) => {
            if (this.api_key !== undefined && this.file !== undefined) {
                this.uploadUrl = await this.getLink().catch((error) => {reject(error)});
                this.result = await this.upload().catch((error) => {reject(error)});
                resolve(this.result);
            }else{
                reject(false);
            }
        });
    }
    getLink() {
        return new Promise((resolve, reject) => {
            if(fs.existsSync(this.file)){
            var size = fs.statSync(this.file)['size']
            var options = {
                url: 'https://vivo.sx/api/v1/upload/' + size,
                method: 'GET',
                headers: {
                    'X-AUTH': this.api_key
                }
            }
    
            request(options, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    var res = JSON.parse(body);
                    if (res.status == true) {
                        resolve(res.upload_url);
                    }
                } else {
                    reject(error);
                }
            });
        }
        });
    }
    upload() {
        return new Promise((resolve, reject) => {
            if(fs.existsSync(this.file)){
            var size = fs.statSync(this.file)['size']
            const options = {
                method: "POST",
                url: this.uploadUrl,
                headers: {
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'multipart/form-data'
                },
                formData: {
                    "action": "push",
                    "session": this.api_key,
                    "file": fs.createReadStream(this.file)
                }
            };
            request(options, function(err, res, body) {
                if (err) {
                    reject(err)
                } else {
                    resolve(body);
                }
            });
        }
        });
    };
}


exports.upload = upload;