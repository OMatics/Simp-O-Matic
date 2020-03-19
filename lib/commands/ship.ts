import { FORMATS } from '../extensions';
import { Message } from 'discord.js';

import { createWriteStream as write_stream,
		 WriteStream } from 'fs';
import { execSync as shell } from 'child_process';
import fetch from 'node-fetch';

const RESPONSES = [
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

const ps = (stream : WriteStream) =>
	new Promise((resolve, reject) => {
		stream.once('error', reject);
		stream.once('finish', resolve);
	});

const make_img = async (u1: string, u2: string) => {
	const res1 = await fetch(u1);
	const res2 = await fetch(u2);
	await ps(res1.body.pipe(write_stream('./u1.png')));
	await ps(res2.body.pipe(write_stream('./u2.png')));

	shell('montage ./u1.png ./heart.png ./u2.png ./out.png',
		{ cwd: process.cwd() });

	return './out.png';
};

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

	const get_response = (num: number) => RESPONSES.filter(res =>
		in_range(res.range, num))[0]?.message
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
		const progress_bar = (`[${ bar.knob.repeat(bar.filling) }`
			+ `${ bar.empty.repeat(bar.space) }]`).format(FORMATS.block);

		return `${percentage} ${progress_bar}`;
	};

	const die = Math.floor(Math.random() * 100);
	const response = `${get_percentage(die)} ${get_response(die)}`;

	make_img(user_avatars.first, user_avatars.second).then(str =>
		message.channel.send(response, {files: [str]}));
};
