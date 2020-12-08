const config = require('./config');
const fs = require('fs');

class upload{
    constructor(file, useconfig, apikeys){
        this.keys = config.getConfig('hoster')
        this.links = [];
        this.file = file;
        this.useconfig = useconfig;
        this.apikeys = apikeys;
    }
    init(){
        return new Promise(async (resolve) => {
            const {doodstream} = require('./uploads/doodstream')
            const {evoload} = require('./uploads/evoload')
            const {gounlimited} = require('./uploads/gounlimited')
            const {mixdrop} = require('./uploads/mixdrop')
            const {nxload} = require('./uploads/nxload')
            const {streamtape} = require('./uploads/streamtape')
            const {vidoza} = require('./uploads/vidoza')
            const {vivo} = require('./uploads/vivo')
            const {jetload} = require('./uploads/jetload')
            if (this.file !== undefined) {
                if (this.useconfig == true) {
                    if (this.keys !== undefined && Array.isArray(this.keys)) {
                        var done = 0;
                        var max = 0;
                        this.keys.forEach(async (key) => {
                            switch (key.name) {
                                case 'doodstream':
                                    if (key.api_key !== undefined) {
                                    max++;
                                    var dood
                                    do {
                                        dood = await new doodstream(key.api_key, this.file).init()
                                    } while (!dood.includes("dood") && fs.existsSync(this.file));
                                    this.links.push(dood)
                                    done++;
                                    }
                                break;
                                case 'jetload':
                                    if(key.api_key !== undefined){
                                        max++;
                                        var jet;
                                        do {
                                            jet = await new jetload(key.api_key, this.file).init();
                                            console.log(jet)
                                        } while (!jet.includes("jetload") && fs.existsSync(this.file));
                                        this.links.push(jet)
                                        done++;
                                    }
                                break;
                                case 'evoload':
                                    if (key.api_key !== undefined) {
                                    max++;
                                    var evo;
                                    do {
                                        evo = await new evoload(key.api_key, this.file).init();
                                    } while (!evo.includes("evoload") && fs.existsSync(this.file));
                                        this.links.push(evo)
                                    done++;
                                    }
                                break;
                                case 'gounlimited':
                                    if (key.api_key !== undefined) {
                                    max++;
                                    var go;
                                    do {
                                        go = await new gounlimited(key.api_key, this.file).init()
                                    } while (!go.includes("gounlimited") && fs.existsSync(this.file));
                                    this.links.push(go)
                                    done++;
                                    }
                                break;
                                case 'mixdrop':
                                    if (key.api_key !== undefined && key.api_user !== undefined) {
                                    max++;
                                    var mix;
                                    do {
                                        mix = await new mixdrop(key.api_key, key.api_user, this.file).init()
                                    } while (!mix.includes("mixdrop") && fs.existsSync(this.file));
                                    this.links.push(mix)
                                    done++;
                                    }
                                break;
                                case 'nxload':
                                    if (key.api_key !== undefined && key.api_user !== undefined) {
                                    max++;
                                    var nx;
                                    do {
                                        nx = await new nxload(key.api_user, key.api_key, this.file).init();
                                    } while (!nx.includes("nxload") && fs.existsSync(this.file));
                                    this.links.push(nx)
                                    done++;
                                    }
                                break;
                                case 'streamtape':
                                    if (key.api_key !== undefined && key.api_user) {
                                    max++;
                                    var stream;
                                    do {
                                        stream = await new streamtape(key.api_user, key.api_key, this.file).init();
                                        console.log(stream)
                                    } while (stream.includes("streamtape") && fs.existsSync(this.file));
                                    this.links.push(stream);
                                    done++;
                                    }
                                break;
                                case 'vidoza':
                                    if (key.api_key !== undefined) {
                                    max++;
                                    var vidozal;
                                    do {
                                        vidozal = await new vidoza(key.api_key, this.file).init();
                                    } while (!vidozal.includes("vidoza") && fs.existsSync(this.file));
                                    this.links.push(vidozal)
                                    done++;
                                    }
                                break;
                                case 'vivo':
                                    if (key.api_key !== undefined) {
                                    max++;
                                    var vivol;
                                    do {
                                        vivol = await new vivo(key.api_key, this.file).init();
                                    } while (!vivol.includes("vivo") && fs.existsSync(this.file));
                                    this.links.push(vivol);
                                    done++;
                                    }
                                break
                                default:
                                 console.log(`${key.name} does not exist!`)
                                break;
                            }
                        })
                    var intervall = setInterval(() => {
                        if (max == done) {
                            resolve(this.links)
                            clearInterval(intervall)
                        }
                    }, 1000);
                    }else{
                         console.error("Keys is undefined or not an Array. Error found at booting up the Upload Manager")
                    }
                }else{
                    if (this.apikeys !== undefined && Array.isArray(this.apikeys)) {
                        
                    }else{
                         console.error("No apikeys found. Error found at booting up the Upload Manager")
                        resolve(false);
                    }
                }
            }else{
                 console.error("No file found. Error found at booting up the Upload Manager")
                resolve(false);
            }
        })
    }
}

exports.upload = upload;