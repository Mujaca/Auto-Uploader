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
        return new Promise(async (resolve) => {
            if (this.api_key !== undefined && this.file !== undefined) {
                this.uploadUrl = await this.getUploadLink();
                this.result = await this.upload(this.uploadUrl)
                resolve(this.result);
                }else{
                    resolve(false);
                }
        })
    }

    getUploadLink() {
        return new Promise(resolve => {
            var my_key = this.api_key;
            var options = {
                url: `https://evoload.io/v1/EvoAPI/${my_key}/get-server`,
                method: 'GET'
            }
    
            request(options, function(error, response, body) {
                this.date = new Date();
                this.timestamp = this.date.toLocaleTimeString();
                if (!error && response.statusCode == 200) {
                    if (body !== undefined && body.startsWith('{')) {
                        const data = JSON.parse(body);
                        resolve(body);   
                    }
                } else {
                    console.error(error);
                    resolve("err")
                }
            });
        });
    }

    upload(res) {
        return new Promise(resolve => {
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
                    console.error('Evoload Error!');
                    console.error(err);
                    resolve("err")
                } else {
                    var res = JSON.parse(body)
                    console.log("Evoload Done")
                    var url = 'https://evoload.io/e/' + res.code;
                    resolve(url);
    
                }
            });
        }catch (err){
            console.error(err)
            resolve("err")
        }
        });
    }
}



exports.upload = evoload