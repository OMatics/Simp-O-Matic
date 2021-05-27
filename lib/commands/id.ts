import { Message } from 'discord.js';

export default (homescope: HomeScope) => {
	const { message } : { message : Message } = homescope;
	const rep = [];
	['channel', 'user', 'role'].forEach(n =>
		message.mentions[`${n}s`].forEach(o => rep.push(`${n} id: \`${o.id}\``)));
	// Joining an empty array yields an empty string which is false
	const reply = rep.join(', ') || `User ID: \`${message.author.id}\`
		Author: ${message.author}
		Message ID: \`${message.id}\``.squeeze();
	console.log(`Replied: ${reply}`);
	message.reply(reply);
};
