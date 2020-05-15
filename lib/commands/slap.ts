import { Message } from 'discord.js';
import Action from '../action';

export default (home_scope: HomeScope) => {
	const { message, args }
		: { message: Message, args: string[] } = home_scope;

	if (args.length === 0 || message.mentions.users.size === 0)
		return message.channel.send(
			"You slapped yourself in the face. :hand_splayed:");

	message.channel.send(Action.get('slap', message));
};
