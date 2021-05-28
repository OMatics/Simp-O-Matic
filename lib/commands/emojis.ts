exports.description = "List all the emojis on the server.";
exports.options = [];

exports.main = (home_scope: HomeScope) => {
	const { message } = home_scope;
	message.reply(
		message.guild.emojis.cache.map(x => x.toString()).join(' ')
	);
};
