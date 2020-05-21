import { MessageAttachment } from 'discord.js';
export default async (home_scope: HomeScope) => {
	const { message } = home_scope;
	const a = new MessageAttachment('../resources/media/instgen.mp3', 'instgen.mp3');
	message.channel.send('', a);
}