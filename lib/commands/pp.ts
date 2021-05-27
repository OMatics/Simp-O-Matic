export default (homescope: HomeScope) => {
	const { message, CONFIG } = homescope;

	let user = message.author.id;
	try {
		user = message.mentions.users.first().id;
	} finally {
		const shaft = '='.repeat(CONFIG.pp_sizes[user]
			|| (CONFIG.pp_sizes[user] = Math.ceil(Math.random() * 16)));
		message.reply(`8${shaft}>`);
	}
};
