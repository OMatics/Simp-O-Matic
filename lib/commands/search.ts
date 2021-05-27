import web_search from '../api/google';
import { TextChannel } from 'discord.js';

export default (homescope: HomeScope) => {
	const { message, args, SECRETS } = homescope;
	const query = args.join(' ').toLowerCase();
	const channel = message.channel as TextChannel;

	web_search({
		kind: 'web',
		query,
		key: SECRETS.google.api_key,
		id: SECRETS.google.search_id,
		nsfw: channel.nsfw
	}).then((res) => message.reply(res))
		.catch(e => message.reply(e));
};
