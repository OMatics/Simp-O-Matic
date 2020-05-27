import { Message } from 'discord.js';
import Action from '../action';

export default (home_scope: HomeScope) => {
	const { message, args }
			: { message: Message, args: string[] } = home_scope;

	if (args.length === 0 || message.mentions.users.size === 0)
		const attached = new MessageAttachment(
			'./lib/resources/suicide.png', 
			'suicide.png');
		return message.channel.send("You killed yourself.");

	message.channel.send(Action.get('kill', message));
};
