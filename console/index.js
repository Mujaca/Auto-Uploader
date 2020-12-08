const readline = require("readline")
const fs = require("fs")

class menu{
    constructor(){
        this.shut = true;
        this.interface = new readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })
        this.interface.on("close", function() {
            console.log("Programm was shutdowned by User")
            process.exit()
        })
        this.commandloader();
        console.log("Menu started!")
    }

    async commandloader(){
        this.interface.on("line", async (line) => {
            var a = line.split(" ")
            const args = a.splice(1, a.length - 1);
            const prefix = line.split(" ")[0]
            var cmds = await this.getcommands();
            var found = false;
            if(prefix.toLowerCase() !== "help")cmds.forEach((cmd) => {
                if(cmd.prefix.toLowerCase() == prefix.toLowerCase()) {cmd.run(args); found = true;};
            });
            if(prefix.toLowerCase() == "help") {this.generateHelp(cmds); found = true;};
            if(!found){
                console.log(`${prefix} wurde nicht gefunden!`)
            }
        })
    }

    async generateHelp(cmds){
        cmds.forEach((cmd) => {
            console.log(`${cmd.prefix} - ${cmd.help}`)
        })
    }

    getcommands(){
        return new Promise((resolve, reject) => {
            const commands = [];
            fs.readdir('./console/commands/', (err, files) => {
                files.forEach((file) => {
                    if(file !== "example.js" && file.endsWith(".js")){
                        var prefix = file.split(".")[0]
                        prefix.replace(" ", "_")
                        var cmd = require(`./commands/${file}`);
                        commands.push(new cmd.menucommand(prefix))
                    }
                })
                resolve(commands);
            })
        })
    }
}

exports.menu = menu;