import { Message } from 'discord.js';

const NUMBER_NAMES = [
	'one', 'two', 'three', 'four', 'five',
	'six', 'seven', 'eight', 'nine', 'keycap_ten'
];

export default (homescope: HomeScope) => {
	const { message, args }
		: { message: Message,
			args: string[] } = homescope;

	const input = args.length === 0
		? "nibba"
		: args.join(' ').toLowerCase();

	const letters = [...input].map((chr: any) => {
		if (chr === ' ') return chr;
		if (isNaN(chr) && /[a-z]/i.test(chr))
			return chr === 'b'
				? chr.emojify()
				: `regional_indicator_${chr}`.emojify();
		if (!isNaN(Number(chr)))
			return NUMBER_NAMES[Number(chr)].emojify();
		return chr;
	});

	message.channel.send(letters.join(' '));
};
