exports.description = "In case you're feeling thirsty...";
exports.options = [];
exports.main = (home_scope: HomeScope) => {
	const { message } = home_scope;
	message.reply(`${(4 + Math.random() * 15).round_to(3)}`
		+ ` gallons of milkies have been deposited in your mouth.`);
};
