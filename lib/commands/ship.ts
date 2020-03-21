import crypto from 'crypto';

import { FORMATS } from '../extensions';
import { Message, Attachment, RichEmbed } from 'discord.js';

import Jimp from 'jimp';

const TEMPLATE = "./lib/resources/ship-template.png";

const RESPONSES = [
	{ range: [0, 9],   message: "Fate has decided you two aren't made for each other. :fearful:" },
	{ range: [9, 24],  message: "You should never cross paths, ever. :no_good:" },
	{ range: [24, 49], message: "Not good. :confounded: :broken_heart:" },
	{ range: [49, 59], message: "Nothing is impossible, but... :slight_frown:" },
	{ range: [59, 64], message: "Friends, but maybe... :smirk:" },
	{ range: [64, 69], message: "We have some chemistry going on here... :heart_eyes:" },
	{ range: [69, 74], message: "A match for sure! :relaxed:" },
	{ range: [74, 79], message: "I approve this couple! :kissing_heart:" },
	{ range: [79, 84], message: "They like each other very much!! :blush:" },
	{ range: [84, 89], message: "If both aren't already dating I'd be surprised! :kissing_closed_eyes:" },
	{ range: [89, 93], message: "Both are made for each other! :relaxed:" },
	{ range: [93, 97], message: "They deeply love each other! :blush:" },
	{ range: [97, 100], message: "Lovey-dovey couple!! :kissing_heart: :heart: :two_hearts:" },
];

export default home_scope => {
	const { message, args,
			HELP_SECTIONS,
			KNOWN_COMMANDS }
	: { message: Message, args: string[],
		HELP_SECTIONS: string[],
		KNOWN_COMMANDS: string[] } = home_scope;

	if (args.length === 0 || args[0] === 'help'
		|| message.mentions.users.size === 0
		|| message.mentions.users.size > 2) {
		message.channel.send(
			HELP_SECTIONS[KNOWN_COMMANDS.indexOf('ship')].trim());
		return;
	}
	const users = [message.mentions.users.size == 1 ? message.author : message.mentions.users.first(), message.mentions.users.last()]
	const user_avatars = {
		first: users[0].avatarURL,
		second: users[1].avatarURL
	};

	const in_range = ([min, max]: number[], num: number) =>
		num >= min && num < max;

	const get_response = (num: number) => RESPONSES
		.filter(res => in_range(res.range, num))[0]?.message
		|| RESPONSES[0].message;

	const get_percentage = (n: number) => {
		const bar = {
			size: 10,
			knob: '█',
			empty: '.',
			get filling(): number {
				return Math.round(n / this.size);
			},
			get space(): number {
				return Math.abs(this.filling - this.size);
			}
		}!;

		const percentage = `${n.toString().format(FORMATS.bold)}%`;
		const progress_bar =
			(`[${ bar.knob.repeat(bar.filling) }` +
			 `${ bar.empty.repeat(bar.space) }]`)
			.format(FORMATS.block);

		return `${percentage} ${progress_bar}`;
	};

	const die = crypto
		.createHash('md5')
		.update(users.reduce((a, c) =>
			a + BigInt(c.id), BigInt(0))
		.toString()).digest().readUInt16LE() % 101;

	const response = `${get_percentage(die)} ${get_response(die)}`;

	const error_msg = e =>
		message.answer("Unable to calculate the love grade :("
			+ `:\n${e.message}`.format('```'));

	const compose_images = async ({ first, second }) => {
		const padding = 4;
		const size = 128;
		const filename = "ship-result.png";

		const template = await Jimp.read(TEMPLATE);
		const fst = await Jimp.read(first);
		const composed = template.blit(fst.resize(Jimp.AUTO, size), 0, 0);
		const snd = await Jimp.read(second);

		const image = await composed.blit(
			snd.resize(Jimp.AUTO, size),
			snd.bitmap.width * 2 + padding, 0);

		image.getBuffer('image/png', (e : Error, buffer : Buffer) => {
			if (e && e.message)
				return error_msg(e);

			const attachment = new Attachment(buffer, filename);
			const embed = new RichEmbed()
				.setColor('#b943e8')
				.setTitle(`Love grade between ` +
						  `${message.mentions.users.first().username} & ` +
						  `${message.mentions.users.last().username}`)
				.setDescription(response)
				.attachFile(attachment)
				.setImage(`attachment://${filename}`);

			message.channel.send(embed);
		});
	};

	try {
		compose_images(user_avatars);
	} catch (e) { error_msg(e); }
};
