var fs = require('fs');
const request = require('request');
 

class streamtape{
    constructor (file, api_key, api_user){
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
            this.result = await this.upload()
            resolve(this.result);
            }else{
                resolve(false);
            }
        });
    }

    getLink(api_user, api_token) {
        return new Promise(resolve => {
            var options = {
                url: `https://api.streamtape.com/file/ul?login=${this.api_user}&key=${this.api_key}`,
                method: 'GET',
                json: true
            }
            request(options, function(error, response, body) {
                if(body !== undefined && body.status == 200){ resolve(body.result.url) }else{resolve("err")};
            });
        });
    }

    upload(uploadUrl, file) {
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
                    try {
                        resolve("https://streamtape.com/e/" + JSON.parse(body).result.id);
                    } catch (error) {
                        console.error(error)
                        resolve("err")
                    }
                }
            });
        });
    };
}


exports.upload = streamtape;