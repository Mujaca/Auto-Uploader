var fs = require('fs');
const request = require('request');
 

class vivo{
    constructor (api_key, file){
        if (api_key !== undefined && file !== undefined) {
        this.api_key = api_key;
        this.file = file;
    }
    }
    init (){
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
                this.date = new Date();
                this.timestamp = this.date.toLocaleTimeString();
                if (!error && response.statusCode == 200) {
                    var res = JSON.parse(body);
                    if (res.status == true) {
                        resolve(res.upload_url);
                    }
                } else {
                     console.error(this.timestamp + " " + error)
                    resolve('err');
                }
            });
        }
        });
    }
    upload() {
        return new Promise(resolve => {
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
                     console.error(err)
                    resolve("err")
                } else {
                    resolve(body);
                     console.log("Vivo done")
                }
            });
        }
        });
    };
}


exports.vivo = vivo;