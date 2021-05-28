import { Message } from 'discord.js';

const NUMBER_NAMES = [
	'one', 'two', 'three', 'four', 'five',
	'six', 'seven', 'eight', 'nine', 'keycap_ten'
];

exports.description = "Turn your text into discord-style emoji.";
exports.options = [{
    name: "phrase",
    type: "STRING",
    description: "Turn your text into discord-style emoji.",
    required: true
}];

exports.main = (home_scope: HomeScope) => {
	const { message, args } = home_scope;

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

	message.reply(letters.join(' '));
};
