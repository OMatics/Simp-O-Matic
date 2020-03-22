import { MessageAttachment } from 'discord.js';

export default (home_scope: HomeScope) => {
	const { message } = home_scope;
	const attached = new MessageAttachment(
		'./lib/resources/crabbing.jpg',
		'crabbing.jpg');
	message.channel.send('Danny, having a jolly time.', attached);
};
