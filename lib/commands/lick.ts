import { Message } from 'discord.js';
import Action from '../action';

export default (homescope: HomeScope) => {
	const { message, args }
		: { message: Message, args: string[] } = homescope;

	if (args.length === 0 || message.mentions.users.size === 0)
		return message.channel.send(
			"You licked your own hand... Tastes salty :yum:");

	message.channel.send(Action.get('lick', message));
};
