import { Message } from 'discord.js';

export default home_scope => {
    const { message, args }
        : { message: Message, args: string[] } = home_scope;

    let input: string;

    if (args.length === 0)
        input = "b";
    else
        input = args.join(' ').toLowerCase();

    const alphabet = 'pb';

    let letters = [...input].map((chr: any) => {
        if (isNaN(chr) && alphabet.includes(chr))
            chr.bee() : `b`.bee();
        else if (chr === ' ')
            return chr;
        else
            return chr;
    })

    message.channel.send(letters.join(' '));
};
