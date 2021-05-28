exports.description = "A e s t h e t i c  t e x t";
exports.main = (home_scope: HomeScope) => {
	const { message, args } = home_scope;
	message.reply(args.join('').split('').join(' '));
};
