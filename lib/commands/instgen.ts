import { MessageAttachment } from 'discord.js';
exports.main = async (home_scope: HomeScope) => {
	const { message } = home_scope;
	message.defer();
	const a = new MessageAttachment('../resources/media/instgen.mp3', 'instgen.mp3');
	message.editReply(a);
}