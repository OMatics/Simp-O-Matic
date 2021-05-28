exports.description = "Get an invite link (needs admin (8) permissions).";
exports.options = [];
exports.main = (home_scope: HomeScope) => {
	const { message } = home_scope;
	message.reply('invite link: https://discordapp.com/api/oauth2/authorize?client_id=684895962212204748&permissions=8&scope=bot');
};
