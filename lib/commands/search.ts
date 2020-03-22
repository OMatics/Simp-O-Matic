import web_search from '../api/google';
import { TextChannel } from 'discord.js';

export default (home_scope: HomeScope) => {
	const { message, args, SECRETS } = home_scope;
	const query = args.join(' ').toLowerCase();
	const channel = message.channel as TextChannel;

	web_search({
		kind: 'web',
		query,
		key: SECRETS.google.api_key,
		id: SECRETS.google.search_id,
		nsfw: channel.nsfw
	}).then((res) => message.answer(res))
		.catch(e => message.answer(e));
};
