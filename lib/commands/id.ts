export default home_scope => {
	const { message } = home_scope;
	const rep = [];
	['channel', 'user', 'role'].each(n =>
		message[n + 's'].each(o => rep.push(n + ' id: `' + o.id + '`')));
	// Joining an empty array yields an empty string which is false
	const reply = rep.join(', ') || `User ID: \`${message.author.id}\`
		Author: ${message.author}
		Message ID: \`${message.id}\``.squeeze();
	console.log(`Replied: ${reply}`);
	message.answer(reply);
};
