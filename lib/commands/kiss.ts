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

	const images = [
		"https://i.imgur.com/a5rkTna.gif",
		"https://i.imgur.com/AnYC2Xi.gif",
		"https://i.imgur.com/9PbQ9Zl.gif",
		"https://i.imgur.com/QZhWnaf.gif",
		"https://i.imgur.com/1PEBQB6.gif",
		"https://i.imgur.com/qW6BWEn.gif",
		"https://i.imgur.com/79hpwpn.gif",
		"https://i.imgur.com/RpxJYVD.gif",
		"https://i.imgur.com/8fcnQFS.gif",
	];

	const embed = new RichEmbed()
		.setColor('#ba3d8a')
		.setTitle("Uh-oh... You're getting a kiss!")
		.setDescription(`${to.format(FORMATS.bold)}, you got a kissu from \
			${author.format(FORMATS.bold)}! :flushed:`.squeeze())
		.setImage(images[Math.floor(Math.random() * images.length)]);

	message.channel.send(embed);
};
