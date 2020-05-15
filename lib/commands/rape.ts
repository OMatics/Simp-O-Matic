import { Message } from 'discord.js';
import Action from '../action';

export default (home_scope: HomeScope) => {
	const { message, args }
		: { message: Message, args: string[] } = home_scope;

	if (args.length === 0 || message.mentions.users.size === 0)
		return message.channel.send(
			"You fisted yourself. :point_right: :ok_hand:");

	message.channel.send(Action.get('rape', message));
};
