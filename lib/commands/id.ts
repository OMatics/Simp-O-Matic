import { Message } from 'discord.js';

export default home_scope => {
	const { message } : { message : Message } = home_scope;
	const rep = [];
<<<<<<< HEAD
	['channel', 'user', 'role'].forEach(n =>
		message.mentions[`${n}s`].forEach(o => rep.push(`${n} id: \`${o.id}\``)));
=======
	message.mentions.channels.each(o => rep.push('channel id: `' + o.id + '`'))
	message.mentions.users.each(o => rep.push('user id: `' + o.id + '`'))
	message.mentions.roles.each(o => rep.push('role id: `' + o.id + '`'))
>>>>>>> 2fb48d88264b67abc4f73d99871d1a4ea78290e5
	// Joining an empty array yields an empty string which is false
	const reply = rep.join(', ') || `User ID: \`${message.author.id}\`
		Author: ${message.author}
		Message ID: \`${message.id}\``.squeeze();
	console.log(`Replied: ${reply}`);
	message.answer(reply);
};
