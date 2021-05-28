import { createHash } from 'crypto';

import { FORMATS } from '../extensions';
import { help_info } from '../utils';

import { MessageAttachment, MessageEmbed } from 'discord.js';
import Jimp from 'jimp';

const TEMPLATE = "./lib/resources/templates/ship.png";

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

const BIG_ZERO = BigInt(0);

const read512bitsBigIntBigEndian = (buffer : Buffer) : bigint => {
	let val = BIG_ZERO;
	for (let i = 512 + 64; i -= 64;)
		val += buffer.readBigUInt64BE(i / 8 - 8) * BigInt(Math.pow(2, i));
	return val;
};

exports.description = "Shows the love grade between two people.";
exports.options = [{
    name: "user",
    type: "USER",
    description: "Shows the love grade between two people.",
    required: true
}, {
    name: "user",
    type: "USER",
    description: "Shows the love grade between two people."
}];
exports.main = (home_scope : HomeScope) => {
	const { message, args, CONFIG } = home_scope;

	var users;
	if(message.options[1].user)
		users = [message.options[0].user, message.options[1].user];
	else
		users = [message.user, message.options[0].user];
	
	const user_avatars = {
		first:  users[0].avatarURL({ 'format': 'png' }),
		second: users[1].avatarURL({ 'format': 'png' })
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

	const die = Number(read512bitsBigIntBigEndian(createHash('sha512')
		.update(users.reduce((a, c) => a + BigInt(c.id), BigInt(0))
		.toString()).digest()) % BigInt(101)); // ^ < 80 cols

	const response = `${get_percentage(die)} ${get_response(die)}`;

	const error_msg = (e: Error) =>
		message.reply("Unable to calculate the love grade :("
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

			const attachment = new MessageAttachment(buffer, filename);
			const embed = new MessageEmbed()
				.setColor('#b943e8')
				.setTitle(`Love grade between \
						  ${users[0].username} & \
						  ${users[1].username}`.squeeze())
				.setDescription(response)
				.attachFiles([attachment])
				.setImage(`attachment://${filename}`);

			message.reply(embed);
		});
	};

	try {
		compose_images(user_avatars);
	} catch (e) { error_msg(e); }
};
