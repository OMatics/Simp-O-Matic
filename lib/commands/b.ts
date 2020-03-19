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

    let letters = [...input].map((chr: any) =>
        isNaN(chr) && alphabet.includes(chr)
            ? `b`.emojify()
            : chr)

    message.channel.send(letters.join(' '));
};
