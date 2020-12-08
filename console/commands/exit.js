class menucommand{
    constructor(prefix){
        this.prefix = prefix;
        this.help = "Beendet das Programm.";
    }

    async run(args){
        process.exit();
    }
}

exports.menucommand = menucommand;