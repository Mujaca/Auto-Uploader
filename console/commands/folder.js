const {watcher} = require('../../uploader/index')
const fs = require('fs');

class menucommand{
    constructor(prefix){
        this.prefix = prefix;
        this.help = "Manage the Folder are currently watched by the Programm!";
    }

    async run(args){
        switch (args[0]) {
            case "add":
                if(args[1]){
                    var folder = args[1]
                    if(fs.existsSync(folder)){
                        const folders = JSON.parse(fs.readFileSync('./watching.json'));
                        folders.push(folder);
                        fs.writeFileSync('./watching.json', JSON.stringify(folders));

                        watcher_array.push(new watcher(folder));
                        console.log("Sucessfully added Folder!")
                    }else{
                        console.log("This Folder doesent exist!")
                    }
                }else{
                    console.log("Usage: folder add <path>")
                }
            break;
            case "remove":
                if(args[1]){
                    watcher_array.forEach((folder) => {
                        if(folder.dir == args[1]) {
                        folder.stop();
                        const folders = JSON.parse(fs.readFileSync('./watching.json'));
                        folders.forEach((singlefolder, index) => {
                            if(singlefolder == folder.dir) folders.splice(index, 1);
                        })
                        fs.writeFileSync('./watching.json', JSON.stringify(folders));
                    }
                    })
                    console.log("Folder removed!")
                }else{
                    console.log("Usage: folder remove <path>")
                }
            break;
            case "get":
                const folders = JSON.parse(fs.readFileSync('./watching.json'));
                folders.forEach(folder => {
                    console.log("Currently Watching: " + folder)
                });
            break;
            default:
                console.log("Available Sub Commands: ")
                console.log("add");
                console.log("remove");
                console.log("get");
                break;
        }
    }
}

exports.menucommand = menucommand;