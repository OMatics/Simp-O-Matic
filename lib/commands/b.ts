import { Message } from 'discord.js';

export default home_scope => {
    const { message, args }
        : { message: Message, args: string[] } = home_scope;

    const input = (args.length === 0)
        ? "b"
        : args.join(' ').toLowerCase();

    const alphabet = 'pb';

    const letters = [...input].map((chr: any) =>
        isNaN(chr) && alphabet.includes(chr)
            ? `b`.emojify()
            : chr);

    message.channel.send(letters.join(' '));
};
