import { Message } from 'discord.js';

export default home_scope => {
    const { message, args }
        : { message: Message, args: string[] } = home_scope;

    let input: string;

    if (args.length === 0)
        input = "nibba";
    else
        input = args.join(' ').toLowerCase();

    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const numerics = [
        'one', 'two', 'three', 'four', 'five',
        'six', 'seven', 'eight', 'nine', 'keycap_ten'
    ];

    let letters = [...input].map((chr: any) => {
        if (isNaN(chr) && alphabet.includes(chr))
            return chr === 'b' ? chr.emojify() : `regional_indicator_${chr}`.emojify();
        else if (chr === ' ')
            return chr;
        else if (!isNaN(Number(chr)))
            return numerics[Number(chr)].emojify();
        else
            return chr;
    })

	message.channel.send(letters.join(' '));
};
