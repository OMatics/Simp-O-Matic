import { MessageAttachment } from 'discord.js';

export default (homescope: HomeScope) => {
	const { message } = homescope;
	const attached = new MessageAttachment(
		'./lib/resources/crabbing.jpg',
		'crabbing.jpg');
	message.channel.send('Danny, having a jolly time.', attached);
};
