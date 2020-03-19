export default home_scope => {
	const { message } = home_scope;
	const rep = [];
	message.mentions.channels.each(o => rep.push('channel id: `' + o.id + '`'))
	message.mentions.users.each(o => rep.push('user id: `' + o.id + '`'))
	message.mentions.roles.each(o => rep.push('role id: `' + o.id + '`'))
	// Joining an empty array yields an empty string which is false
	const reply = rep.join(', ') || `User ID: \`${message.author.id}\`
		Author: ${message.author}
		Message ID: \`${message.id}\``.squeeze();
	console.log(`Replied: ${reply}`);
	message.answer(reply);
};
