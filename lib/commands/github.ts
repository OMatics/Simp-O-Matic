exports.description = "Get GitHub link. (https://github.com/Demonstrandum/Simp-O-Matic)";
exports.options = [];
exports.main = (home_scope: HomeScope) => {
	const { message, GIT_URL } = home_scope;
	message.reply(`${GIT_URL}/`);
};
