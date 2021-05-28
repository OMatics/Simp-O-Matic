exports.description = "Fork the repository and send me a pull-request for your patches. (https://github.com/Demonstrandum/Simp-O-Matic/fork)";
exports.options = [];
exports.main = (home_scope: HomeScope) => {
	const { message, GIT_URL } = home_scope;
	message.reply(`${GIT_URL}/fork`);
};
