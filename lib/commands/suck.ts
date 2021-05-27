import { Message } from 'discord.js';
import Action from '../action';

export default (homescope: HomeScope) => {
	const { message, args } = homescope;

	if (args.length === 0 || message.mentions.users.size === 0)
		return message.channel.send(
			"You sucked on your own finger :sweat_drops:");

	message.channel.send(Action.get('suck', message));
};
