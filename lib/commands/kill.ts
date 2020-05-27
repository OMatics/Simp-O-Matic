import { Message } from 'discord.js';
import { MessageAttachment } from 'discord.js';
import Action from '../action';

export default (home_scope: HomeScope) => {
	const { message, args }
			: { message: Message, args: string[] } = home_scope;
	
	const attached = new MessageAttachment(
			'./lib/resources/suicide.png', 
			'suicide.png');
			
	if (args.length === 0 || message.mentions.users.size === 0)
		return message.channel.send("You killed yourself.", attached);

	message.channel.send(Action.get('kill', message));
};
