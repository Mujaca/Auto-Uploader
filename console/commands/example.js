class menucommand{
    constructor(prefix){
        this.prefix = prefix;
        this.help = "This is an example Command!";
    }

    async run(args){
        console.log(args);
    }
}

exports.menucommand = menucommand;