const fs = require("fs");

class watcher{
    constructor(directory){
        this.dir = directory;
        this.current = [];
        this.interval = setInterval(async () => {
            fs.readdir(this.dir, async (err, files) => {
                files.forEach(async (file) => {
                    if((file.endsWith(".mp4") || file.endsWith("mkv"))){
                        if(await this.checkFile(file))this.work(file)
                    }
                })
            })
        }, 1000);
    }
    async checkFile(file){
        return new Promise((resolve, reject) => {
            if(fs.existsSync(`${this.dir}${file}`)){
            fs.stat(`${this.dir}${file}`, (error, stats) => {
                var s1 = 1
                if(stats !== undefined) s1 = stats['size']
                setTimeout(() => {
                    fs.stat(`${this.dir}${file}`, (error, stat) => {
                        var s2 = 2
                        if(stat !== undefined) s2 = stat["size"]
                        if(s1 == s2) resolve(true);
                        if(s1 !== s2) resolve(false);
                    })
                }, 2000);
            })
        }else{
            resolve(false)
        }
        })
    }
    async work(file){
        if(!this.current.includes(file)){
            this.current.push(file);
            const {upload} = require('./upload')
            var prep = new upload(file);
            var links = await prep.upload()
            console.debug(JSON.stringify(links))
            var filename = file;
            filename = filename.replace(".mp4", ""); filename = filename.replace(".mkv", " ");
            this.writeFile(filename, links)
            this.removeFile(file);
        }
    }
    async removeFile(file){
        if(this.current.includes(file)){
            fs.unlink(`${this.dir}${file}`, (err) => {
                if(err) console.error(err)
            })
            this.current.forEach((f, index) => {
                if(f == file) this.current.splice(index, 1)
            })
        }
    }
    writeFile(filename, links){
        var results = config.getConfig("results")
        if(!fs.existsSync(results)) fs.mkdir(results, (err) => {console.error(err)})
        fs.writeFile(`${results}${filename}.json`, JSON.stringify(Object.values(links)), (error) => {if(error)console.error(error)})
        if(config.getConfig("generateWordpress")) fs.writeFile(`${results}${filename}_WORDPRESS.txt`, this.generateWordpress(Object.values(links)), (error) => {if(error) console.error(error)})
    }

    generateWordpress(links){
        var hosters = require('../hoster.json')
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
        var senpai = '';
        orderedHoster.forEach((singleHoster) => {
          links.forEach((link) => {
            if (link.startsWith(hosters[singleHoster.name])) {
              if (singleHoster.name == 'vivo') {
                link.replace('https://vivo.sx/', 'https://vivo.sx/embed/');
              }
              senpai = senpai + `[tab:${singleHoster.name.toUpperCase()}]<iframe width="100%" height="100%" src="${link}" frameborder="0" allowfullscreen="true"></iframe>\n`
            }
          })
        })
        senpai = senpai + '[tab:END]'
        return senpai;
    }
}

exports.watcher = watcher;