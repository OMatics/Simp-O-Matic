import { Message } from 'discord.js';
import { MessageAttachment } from 'discord.js';
import Action from '../action';

export default (home_scope: HomeScope) => {
	const { message, args }
			: { message: Message, args: string[] } = home_scope;
	
	const attached = new MessageAttachment(
			'https://img2.gelbooru.com/images/12/86/1286caaa436406cc4e283e8fd0277a74.png', 
			'suicide.png');
			
	if (args.length === 0 || message.mentions.users.size === 0)
		return message.channel.send("You killed yourself.", attached);

	message.channel.send(Action.get('kill', message));
};
