exports.description = "**GNU Affero GPLv3 (`AGPL-3.0`), _Free_ as in Freedom.**";
exports.options = [];
exports.main = (home_scope: HomeScope) => {
	const { message } = home_scope;
	message.reply(
		"**GNU Affero GPLv3 (`AGPL-3.0`), _Free_ as in Freedom.**");
	message.webhook.send("<:AGPL:740958423008411678>");
};
