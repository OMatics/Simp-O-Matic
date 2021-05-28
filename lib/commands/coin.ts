exports.description = "Flip a coin.";
exports.options = [];

exports.main = (home_scope: HomeScope) => {
	const { message } = home_scope;
	message.reply(Math.random() < 0.5 ? 'Heads!' : 'Tails!');
};