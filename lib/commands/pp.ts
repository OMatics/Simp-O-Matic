exports.options = [{
	name: "user",
	type: "USER",
	description: "pp"
}];
exports.main = (home_scope: HomeScope) => {
	const { message, CONFIG } = home_scope;

	let user = message.user.id;
	try {
		user = message.options[0].user.id;
	} finally {
		const shaft = '='.repeat(CONFIG.pp_sizes[user]
			|| (CONFIG.pp_sizes[user] = Math.ceil(Math.random() * 16)));
		message.reply(`8${shaft}>`);
	}
};
