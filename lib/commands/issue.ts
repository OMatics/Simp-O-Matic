exports.description = "Spot a bug, have an issue or want to request a new feature? There's a page for that. (https://github.com/Demonstrandum/Simp-O-Matic/issues)";
exports.options = [];
exports.main = (home_scope: HomeScope) => {
	const { message, GIT_URL } = home_scope;
	message.reply(`${GIT_URL}/issues`);
};
