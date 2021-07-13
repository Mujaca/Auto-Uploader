const {google} = require('googleapis');
const fs = require("fs");
const {upload} = require('../../uploader/upload')

class menucommand{
    constructor(prefix){
        this.prefix = prefix;
        this.help = "This is an example Command!";
    }

    async run(args){
        try {
            const credentials = require('../google_credentials/credentials.json');
            const token = require('../google_credentials/token.json');
            if(args.length < 2) {
                console.log("Usage:")
                console.log("google folder <folderID>")
                console.log("google file <fileID>")
                return;
            }
            switch (args[0].toLowerCase()) {
                case 'folder':
                    this.folder(args[1])
                    break;
                case 'file':
                    var file = await this.download(args[1])
                    var prep = new upload(file.file);
                    var links = await prep.upload()

                    this.writeFile(file.name, links)
                    fs.unlink(`./temp/${file.name}`, (err) => {
                      if(err) console.error(err)
                    })
                    break;
                default:
                    console.log("Usage:")
                    console.log("google folder <folderID>")
                    console.log("google file <fileID>")
                    break;
            }
        } catch (error) {
            console.error(error);
            return; 
        }
    }

    download(fileID) {
        return new Promise((resolve, reject) => {
            const credentials = require('../google_credentials/credentials.json');
            const token = require('../google_credentials/token.json');

            const {client_secret, client_id, redirect_uris} = credentials.installed;
            const auth = new google.auth.OAuth2( client_id, client_secret, redirect_uris[0]);
            auth.setCredentials(token);
            const drive = google.drive({version: 'v3', auth});

            drive.files.get({ fileId: fileID }, (err, res) => {
              var data = res.data;
              if(data.mimeType == "video/mp4") {
                if(!fs.existsSync('./temp/')) fs.mkdirSync('./temp/')
                const dest = fs.createWriteStream('./temp/' + data.name);
                drive.files.get({ fileId: fileID, alt: 'media' }, {responseType: 'stream'}, (err, res) => {
                  res.data.on('end', () => {
                    resolve({file: './temp/' + data.name, name: data.name});
                  })
                  .on('error', (error) => {
                    resolve('404');
                  })
                  .pipe(dest)
                })

              }else{
                console.log("File needs to be an mp4 Video")
                return;
              }
            })
        })
    }

    async folder(folderid){
      var pageToken = null;
      var files = []

      while (files.length == 0 || pageToken ) {
          var res = await this.getDriveFiles(folderid, pageToken)
          res.files.forEach((file) => {
              files.push(file);
          })
          pageToken = res.pagetoken
      }
      files.reverse();
      for (let index = 0; index < files.length; index++) {
          const element = files[index];
          var file = await this.download(element.id)

          var prep = new upload(file.file);
          var links = await prep.upload()

          this.writeFile(file.name, links)
          fs.unlink(`./temp/${file.name}`, (err) => {
            if(err) console.error(err)
          })

          this.current++;
      }
    }

    async getDriveFiles(folderid, pagetoken) {
      const credentials = require('../google_credentials/credentials.json');
      const token = require('../google_credentials/token.json');
      const {client_secret, client_id, redirect_uris} = credentials.installed;
      const auth = new google.auth.OAuth2( client_id, client_secret, redirect_uris[0]);
      auth.setCredentials(token);
      const drive = google.drive({version: 'v3', auth});

      return new Promise((resolve, reject) => {
          drive.files.list({
              fields: 'nextPageToken, files(id, name)',
              q: `'${folderid}' in parents`,
              pageToken: pagetoken,
              pageSize: 100
          }, (err, res) => {
              if(err) resolve({files: [], pagetoken: null});
              if(res && res.data) {
                  pagetoken = res.data.nextPageToken
                  resolve({files: res.data.files, pagetoken: pagetoken})
              }else{
                  resolve({files: [], pagetoken: null});
              }
          })
      })
    }

    writeFile(filename, links){
        var results = config.getConfig("results")
        if(!fs.existsSync(results)) fs.mkdir(results, (err) => {console.error(err)})
        fs.writeFile(`${results}${filename}.json`, JSON.stringify(Object.values(links)), (error) => {if(error)console.error(error)})
        if(config.getConfig("generateWordpress")) fs.writeFile(`${results}${filename}_WORDPRESS.txt`, this.generateWordpress(Object.values(links)), (error) => {if(error) console.error(error)})
    }

    generateWordpress(links){
        var hosters = require('../../hoster.json')
        const hoster = config.getConfig('hoster')
        var orderedLinks = '';
        var orderedHoster = [];
        var maxpreffered = 0;
        hoster.forEach((hoster) => {
          if (hoster.preferred !== undefined && hoster.preferred !== null && !isNaN(hoster.preferred) && hoster.preferred > maxpreffered) {maxpreffered = hoster.preferred;}
        })
        for (let index = maxpreffered; index > 0; index--) {
          const element = hoster.find(element => element.preferred === index);
          if(element !== undefined && element !== null)orderedHoster.push(element)
        }
        hoster.forEach((singlehoster) => {
          if (!orderedHoster.includes(singlehoster)) {
            orderedHoster.push(singlehoster);
          }
        })
        var senpai = '<script src="https://cdn.jsdelivr.net/gh/Akamegakill-Dev/dropdown@main/v3/class.js"></script>\n<select class="vid_select">\n';
        orderedHoster.forEach((singleHoster) => {
          links.forEach((link) => {
            if (link && link.startsWith(hosters[singleHoster.name])) {
              if (singleHoster.name.toLowerCase() == 'vivo') {
                link = link.replace('https://vivo.sx/', 'https://vivo.sx/embed/');
              }
              singleHoster.name = singleHoster.name.charAt(0).toUpperCase() + singleHoster.name.slice(1);
              if(senpai == '<script src="https://cdn.jsdelivr.net/gh/Akamegakill-Dev/dropdown@main/v3/class.js"></script>\n<select class="vid_select">') {
                  senpai = senpai + `<option value="${link}" data-preselect="select">${singleHoster.name}</option>\n`
              }else{
                senpai = senpai + `<option value="${link}">${singleHoster.name}</option>\n`
              }
            }
          })
        })
        senpai = senpai + '</select>\n<iframe id="videoFrame" src="" frameborder="0" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true"></iframe>\n<script src="https://cdn.jsdelivr.net/gh/Akamegakill-Dev/dropdown@main/script.js"></script>'
        return senpai;
    }
}

exports.menucommand = menucommand;