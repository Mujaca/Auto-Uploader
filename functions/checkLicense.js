const axios = require('axios').default

async function checkLicense(license) {
    return new Promise((resolve, reject) => {
        axios.post('https://mujaca.de/api/project/license/check', {
            license: license
        })
        .catch((error) => {
            resolve(false);
        })
        .then((response) => {
            resolve(response.data)
        })
    })
}

exports.checkLicense = checkLicense;