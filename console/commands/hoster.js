class menucommand{
    constructor(prefix){
        this.prefix = prefix;
        this.help = "This is an example Command!";
    }

    async run(args){
        switch (args[0]) {
            case "add":
                if(args[1] !== undefined && args[2] !== undefined){
                    var hoster = config.getConfig("hoster");
                    var f = false;
                    hoster.forEach((singlehoster) => {
                        if(singlehoster.name.toLowerCase() == args[1].toLowerCase()){
                            f = true;
                            singlehoster["api_key"] = args[2];
                            if(args[3] !== undefined) singlehoster["preferred"] = parseInt(args[3]);
                            if(args[4] !== undefined) singlehoster["api_user"] = parseInt(args[4]);
                        }
                    })
                    if(!f){
                        var singlehoster = {};
                        singlehoster["name"] = args[1].toLowerCase();
                        singlehoster["api_key"] = args[2];
                        if(args[3] !== undefined) singlehoster["preferred"] = parseInt(args[3]);
                        if(args[4] !== undefined) singlehoster["api_user"] = args[4];
                        hoster.push(singlehoster);
                    }
                    config.writeConfig("hoster", hoster)
                    console.log(`Hoster ${args[1]} added!`)
                }else{
                    console.log("usage: hoster add <hostername> <api_key> <preffered> <api_user>")
                }
            break;
            case "remove":
                if(args[1] !== undefined){
                    var hoster = config.getConfig("hoster");
                    var f = false;
                    hoster.forEach((singlehoster, index) => {
                        if(singlehoster.name.toLowerCase() == args[1].toLowerCase()) {hoster.splice(index, 1); f = true;}
                    })
                    config.writeConfig("hoster", hoster)
                    if(f) console.log(`${args[1]} was deleted!`)
                    if(!f) console.log(`${args[1]} was not found!`)
                }else{
                    console.log("usage: hoster remove <hostername>")
                }
            break;
            case "help":
                console.log(this.help)
                console.log("Available Sub commands:")
                console.log("add");
                console.log("remove");
            break;
            default:
                console.log("Available Sub commands:")
                console.log("add");
                console.log("remove");
            break;
        }
    }
}

exports.menucommand = menucommand;