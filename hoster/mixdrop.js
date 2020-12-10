var fs = require('fs');
const request = require('request');
 

class mixdrop{
    constructor (file, api_key, api_email){
        if (api_key !== undefined && api_email !== undefined && file !== undefined) {
            this.api_key = api_key;
            this.api_email = api_email;
            this.file = file;
        }
    }

    init(){
        return new Promise(async (resolve, reject) => {
            if (this.api_key !== undefined && this.api_email !== undefined && this.file !== undefined) {
                this.result = await this.upload().catch((error) => {reject(error)})
                resolve(this.result);
                }else{
                    reject(false);
                }
        })
    }

    upload() {
        return new Promise((resolve, reject) => {
            const options = {
                method: "POST",
                url: "https://ul.mixdrop.co/api",
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                formData: {
                    email: this.api_email,
                    key: this.api_key,
                    "file": fs.createReadStream(this.file)
                }
            };
            request(options, async function(err, res, body) {
                if (err) {
                    console.error(err);
                    reject(err)
                } else {
                    var fileref = JSON.parse(res.body).result.fileref
                    resolve(`https://mixdrop.co/e/${fileref}`)
                }
            });
        });
    };
}



exports.upload = mixdrop;