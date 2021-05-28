exports.description = "Local time relative to bot";
exports.options = [];
exports.main = (home_scope: HomeScope) => {
	const { message } = home_scope;
	const now = new Date();
	message.reply(`Local time relative to bot:
		${now.toString()} / ${now.toISOString().format('`')}
		${now.valueOf().toString().format('`')}`.squeeze());
};
