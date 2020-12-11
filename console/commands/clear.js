class menucommand{
    constructor(prefix){
        this.prefix = prefix;
        this.help = "Clear the console!";
    }

    async run(args){
        console.clear();
        console.log("Mujaca`s AutoUploader")
    }
}

exports.menucommand = menucommand;