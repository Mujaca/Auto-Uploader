const { writeConfig, getConfig } = require("../../functions/config");

class menucommand{
    constructor(prefix){
        this.prefix = prefix;
        this.help = "Edit the config as you wish!";
    }

    async run(args){
        switch (args[0]) {
            case "edit":
                if(args[1] == "generateWordpress" || args[1] == "results" || args[1] == "license") {
                    writeConfig(args[1], args[2])
                    console.log("Done!")
                }else{
                    console.log("You can currently only edit 'generateWordpress' & 'results' & 'license'");
                    console.log("Please use the hoster command to add a new Hoster!");
                }
            break;
            case "get":
                console.log(getConfig())
            break;
            default:
                console.log("Available Sub Commands: ")
                console.log("edit");
                console.log("get");    
            break;
        }
    }
}

exports.menucommand = menucommand;