import { MessageAttachment } from 'discord.js';
export default async (homescope: HomeScope) => {
	const { message } = homescope;
	const a = new MessageAttachment('../resources/media/instgen.mp3', 'instgen.mp3');
	message.channel.send('', a);
}