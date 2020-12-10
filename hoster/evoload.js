var fs = require('fs');
const request = require('request');


class evoload{

    constructor (file, api_key) {
        if (api_key !== undefined && file !== undefined) {
            this.api_key = api_key;
            this.file = file;
        }
    }

    init() {
        return new Promise(async (resolve, reject) => {
            if (this.api_key !== undefined && this.file !== undefined) {
                this.uploadUrl = await this.getUploadLink().catch((error) => {reject(error);});
                this.result = await this.upload(this.uploadUrl).catch((error) => {reject(error);})
                resolve(this.result);
                }else{
                    reject(false);
                }
        })
    }

    getUploadLink() {
        return new Promise((resolve, reject) => {
            var my_key = this.api_key;
            var options = {
                url: `https://evoload.io/v1/EvoAPI/${my_key}/get-server`,
                method: 'GET'
            }
    
            request(options, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    if (body !== undefined && body.startsWith('{')) {
                        const data = JSON.parse(body);
                        resolve(body);   
                    }else{
                        reject(error)
                    }
                } else {
                    console.error(error);
                    reject(error)
                }
            });
        });
    }

    upload(res) {
        return new Promise((resolve, reject) => {
            try{
            var data = JSON.parse(res);
            var url = data.url;
            var options = {
                url: data.url,
                formData: {
                    "key": this.api_key,
                    "file": fs.createReadStream(this.file)
                },
                method: 'POST'
            }
            var req = request.post(options, function(err, response, body) {
                if (err) {
                    reject(err)
                } else {
                    var res = JSON.parse(body)
                    console.log("Evoload Done")
                    var url = 'https://evoload.io/e/' + res.code;
                    resolve(url);
    
                }
            });
        }catch (err){
            reject(err)
        }
        });
    }
}



exports.upload = evoload