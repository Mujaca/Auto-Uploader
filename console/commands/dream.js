class menucommand{
    constructor(prefix){
        this.prefix = prefix;
        this.help = "the answer to life the universe and everything!";
    }

    async run(args){
        console.log(42);
    }
}

exports.menucommand = menucommand;