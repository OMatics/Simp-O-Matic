exports.description = "Repeats what you told it to say.";

exports.main = (home_scope: HomeScope) => {
	const { message, args } = home_scope;
	message.reply(`Me-sa says: “${args.join(' ')}”`);
};
