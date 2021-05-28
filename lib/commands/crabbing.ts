import { MessageAttachment, MessageEmbed } from 'discord.js';

exports.main = (home_scope: HomeScope) => {
	const { message } = home_scope;
	const embed = new MessageEmbed();
	embed.setDescription("Danny, having a jolly time.");
	message.reply(embed);
	const attached = new MessageAttachment(
		'./lib/resources/crabbing.jpg',
		'crabbing.jpg');
	embed.attachFiles([attached]);
	embed.setImage("attachment://crabbing.jpg")
	message.editReply(embed);
};
