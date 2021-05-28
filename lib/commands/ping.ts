exports.description = "Test the response-time/latency of the bot, by observing the time elapsed between the sending of this command, and the subsequent (one-word) response from the bot.";
exports.options = [];
exports.main = (home_scope: HomeScope) => {
	const { message } = home_scope;
	message.reply('PONGGERS!');
};
