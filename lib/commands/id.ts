export default home_scope => {
	const { message } = home_scope
	const rep = [];
	['channel', 'user', 'role'].forEach(n => 
		message[n + 's'].each(o => rep.push(n + ' id: `' + o.id + '`'))
	)
	//joining an empty array yields an empty string which is false
	const reply = rep.join(', ') || `User ID: \`${message.author.id}\`
		Author: ${message.author}
		Message ID: \`${message.id}\``;
	console.log(`Replied: ${reply}`);
	message.answer(reply);
}