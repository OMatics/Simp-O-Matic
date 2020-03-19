import { FORMATS } from '.././extensions';
import { RichEmbed, Message } from 'discord.js';

export default home_scope => {
	const { message, args }
		: { message: Message, args: string[] } = home_scope;

	if (args.length === 0 || message.mentions.users.size === 0)
		return message.channel.send(
			"You kissed your own hand. :face_with_hand_over_mouth:");

	const author = message.author.username;
	const to = message.mentions.users.first().username;

	const embed = new RichEmbed()
		.setColor('#ba3d8a')
		.setTitle("Uh-oh... You're getting a kiss!")
		.setDescription(`${to.format(FORMATS.bold)}, you got a kissu from \
			${author.format(FORMATS.bold)}! :flushed:`.squeeze())
		.setImage('https://i.imgur.com/lz1BY2x.gif');

	message.channel.send(embed);
};
