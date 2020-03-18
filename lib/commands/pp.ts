export default home_scope => {
	const { message, CONFIG } = home_scope;
	try{
		var user = message.mentions.users.first().id;
	} catch{
		var user = message.author.id;
	}
	if(!user)
		var user = message.author.id;
	message.answer('8' + '='.repeat(CONFIG.pp_sizes[user]?CONFIG.pp_sizes[user]:CONFIG.pp_sizes[user] = Math.ceil(Math.random() * 16)) + '>')
}
