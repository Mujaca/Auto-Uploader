const axios = require('axios').default;
const fs = require('fs');

class menucommand{
    constructor(prefix){
        this.prefix = prefix;
        this.help = "Download extra Hoster or commands";
    }

    async run(args){
        switch (args[0]) {
            case 'command':
                var link = args[1];
                var l = link.split("/");
                var filename = l[l.length - 1];
                if(link !== undefined){
                    axios.get(link).catch((error) => console.error(error)).then((response) => {
                        fs.writeFile(`./console/commands/${filename}`, response.data);
                    })
                }else{
                    console.log("usage: download command <downlaod link>")
                }
            break;
            case 'hoster':
                var link = args[1];
                var l = link.split("/");
                var filename = l[l.length - 1];
                if(link !== undefined){
                    axios.get(link).catch((error) => console.error(error)).then((response) => {
                        fs.writeFile(`./hoster/${filename}`, response.data);
                    })
                }else{
                    console.log("usage: download hoster <downlaod link>")
                }
            break;
            default:
                console.log("Available subcommands:")
                console.log("command");
                console.log("hoster");
                break;
        }
    }
}

exports.menucommand = menucommand;