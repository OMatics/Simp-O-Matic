export default home_scope => {
	const { message, CONFIG } = home_scope;

	let user = message.author.id;
	try {
		user = message.mentions.users.first().id;
	} finally {
		const shaft = '='.repeat(
			CONFIG.pp_sizes[user]
				? CONFIG.pp_sizes[user]
				: CONFIG.pp_sizes[user] = Math.ceil(Math.random() * 16));

		message.answer(`8${shaft}>`);
	}
};
