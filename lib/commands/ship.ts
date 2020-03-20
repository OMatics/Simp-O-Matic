import { FORMATS } from '../extensions';
import { Message, RichEmbed } from 'discord.js';

import Jimp from 'jimp';

const TEMPLATE = "../../resources/ship-template.png";

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

	const user_avatars = {
		first: message.mentions.users.size === 1
			? message.author.avatarURL
			: message.mentions.users.first().avatarURL,
		second: message.mentions.users.last().avatarURL
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

	const die = Math.floor(Math.random() * 100);
	const response = `${get_percentage(die)} ${get_response(die)}`;

	const compose_images = ({ first, second }) => {
		const padding = 4;
		const size = 128;
		const filename = "ship-result.png";

		Jimp.read(TEMPLATE).then(template => {
			Jimp.read(first).then(fst => {
				return template.blit(fst.resize(Jimp.AUTO, size), 0, 0);
			}).then(composed => {
				Jimp.read(second).then(snd => {
					return composed.blit(snd.resize(Jimp.AUTO, size),
										 snd.bitmap.width * 2 + padding, 0);
				}).then(image => {
					const embed = new RichEmbed()
						.setColor('#b943e8')
						.setTitle(`Love grade between` +
								  `${message.mentions.users.first().username} & ` +
								  `${message.mentions.users.last().username}`)
						.setDescription(response)
						.attachFiles([{
							attachment: image.bitmap.data,
							name: filename
						}])
						.setImage(`attachment://${filename}`);

					message.channel.send(embed);
				});
			});
		}).catch(() => {
			message.answer("Unable to calculate the love grade :(");
		});
	};

	compose_images(user_avatars);
};
